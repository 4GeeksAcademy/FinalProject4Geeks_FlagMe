"""
This module contains all the routes related to rejections management, including creating and getting rejections.
"""
import re

from flask import request, jsonify, Blueprint
from flask_cors import CORS

# Import the supabase client
from api.supabase import supabase

rejections = Blueprint('rejections_api', __name__)

# Allow CORS requests to this API
CORS(rejections)

# Supabase endpoints

# Get all rejections for a user
@rejections.route('/<user_id>', methods=['GET'])
def get_rejections(user_id):
    
    # Get user_id from query params or JWT token
    user_id = request.args.get('user_id')

    # Get rejections sent by the user
    response = supabase.table('rejections').select(
        '*, profiles!rejected_user_id(id, name, age, profile_pic, location, bio)').eq('user_id', user_id).execute()

    # Transform response
    rejections_sent = [
        {
            'rejection_id': rejection['id'],
            'to_user': {
                'id': rejection['profiles']['id'],
                'name': rejection['profiles']['name'],
                'age': rejection['profiles']['age'],
                'profile_pic': rejection['profiles']['profile_pic'],
                'location': rejection['profiles']['location'],
                'bio': rejection['profiles']['bio']
            },
            'created_at': rejection['created_at']
        }
        for rejection in response.data
    ]

    return jsonify(rejections_sent), 200

# Create a new rejection
@rejections.route('/', methods=['POST'])
def create_rejection():
    data = request.get_json()  # Get the JSON data of the frontend request
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    user_id = data.get('user_id')
    rejected_user_id = data.get('rejected_user_id')

    try:
        insert_response = supabase.table(
            'rejections').insert({'user_id': user_id, 'rejected_user_id': rejected_user_id}).execute()
        print("Insert response: ", insert_response)
        return jsonify(insert_response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    