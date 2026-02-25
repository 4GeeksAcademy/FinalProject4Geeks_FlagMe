"""
This module contains all the routes related to likes management, including creating, deleting and getting likes.
"""
import re

from flask import request, jsonify, Blueprint
from flask_cors import CORS

# Import the supabase client
from api.supabase import supabase

likes = Blueprint('likes_api', __name__)

# Allow CORS requests to this API
CORS(likes)

# Supabase endpoints

# Get all likes for a user


@likes.route('/<user_id>', methods=['GET'])
def get_likes(user_id):

    # Get likes sent by the user
    response = supabase.table('likes').select(
        '*, profiles!to_user_id(id, name, age, profile_pic, location, bio)').eq('from_user_id', user_id).execute()

    # Transform response
    likes_sent = [
        {
            'like_id': like['id'],
            'to_user': {
                'id': like['profiles']['id'],
                'name': like['profiles']['name'],
                'age': like['profiles']['age'],
                'profile_pic': like['profiles']['profile_pic'],
                'location': like['profiles']['location'],
                'bio': like['profiles']['bio']
            },
            'created_at': like['created_at']
        }
        for like in response.data
    ]

    return jsonify(likes_sent), 200

# Create a new like or match if the like already exists in the opposite direction (to_user_id -> from_user_id)


@likes.route('/', methods=['POST'])
def create_like():
    data = request.get_json()  # Get the JSON data of the frontend request
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')

    if not from_user_id or not to_user_id:
        return jsonify({"error": "from_user_id and to_user_id are required"}), 400

    # If to_user already has a like from from_user, then post a new match instead of a like
    existing_like = supabase.table('likes').select(
        '*').eq('from_user_id', to_user_id).eq('to_user_id', from_user_id).execute()
    if existing_like.data:

        # Clear to_user's first like to avoid duplicate matches
        supabase.table('likes').delete().eq('from_user_id', to_user_id).eq(
            'to_user_id', from_user_id).execute()

        # Create a new match
        match_data = {'user_1_id': from_user_id, 'user_2_id': to_user_id}
        try:
            insert_response = supabase.table(
                'matches').insert(match_data).execute()
            print("Insert response: ", insert_response)
            return jsonify({
                "message": "Match created successfully",
                "data": insert_response.data
            }), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # Create a new like
    like_data = {'from_user_id': from_user_id, 'to_user_id': to_user_id}

    try:
        insert_response = supabase.table(
            'likes').insert(like_data).execute()
        print("Insert response: ", insert_response)
        return jsonify({
            "message": "Like created successfully",
            "data": insert_response.data
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Delete a like
@likes.route('/', methods=['DELETE'])
def delete_like():
    data = request.get_json()  # Get the JSON data of the frontend request
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')

    if not from_user_id or not to_user_id:
        return jsonify({"error": "from_user_id and to_user_id are required"}), 400

    # Add the rejected user to the rejections table to avoid showing the same user again in the future
    try:
        insert_response = supabase.table(
            'rejections').insert({'user_id': from_user_id, 'rejected_user_id': to_user_id}).execute()
        print("Insert response: ", insert_response)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Delete the like
    try:
        insert_response = supabase.table(
            'likes').delete().eq('from_user_id', from_user_id).eq('to_user_id', to_user_id).execute()
        print("Delete response: ", insert_response)
        return jsonify({"message": "Like deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
