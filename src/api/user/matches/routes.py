"""
This module contains all the routes related to matches management, including getting and deleting matches.
"""
import re

from flask import request, jsonify, Blueprint
from flask_cors import CORS

# Import the supabase client
from api.supabase import supabase

matches = Blueprint('matches_api', __name__)

# Allow CORS requests to this API
CORS(matches)

# Supabase endpoints

# Get all matches for a user


@matches.route('/<user_id>', methods=['GET'])
def get_matches(user_id):

    # Get matches for the user
    response = supabase.table('matches').select(
        'id, created_at, user_1_id, user_2_id, '
        'user1:profiles!user_1_id(id, name, age, profile_pic, location, bio), '
        'user2:profiles!user_2_id(id, name, age, profile_pic, location, bio)'
    ).or_(f"user_1_id.eq.{user_id},user_2_id.eq.{user_id}") \
        .execute()

    # Transform response
    matches = []
    for match in response.data:
        matched_user = match['user2'] if match['user_1_id'] == user_id else match['user1']
        if matched_user is None:
            continue
        matches.append({
            'match_id': match['id'],
            'matched_user': matched_user,
            'created_at': match['created_at']
        })

    return jsonify(matches), 200

# Delete a match


@matches.route('/<match_id>', methods=['DELETE'])
def delete_match(match_id):

    # Get the rejecting user_id from request body or JWT token
    data = request.get_json()
    current_user_id = data.get('user_id')

    # Get the match details to identify the other user
    match_response = supabase.table('matches').select(
        '*').eq('id', match_id).execute()

    if not match_response.data:
        return jsonify({"error": "Match not found"}), 404

    match = match_response.data[0]

    # Identify the other user
    other_user_id = match['user_2_id'] if match['user_1_id'] == current_user_id else match['user_1_id']

    # Insert into rejected_profiles
    supabase.table('rejections').insert({
        'user_id': current_user_id,
        'rejected_user_id': other_user_id
    }).execute()

    # Delete the match
    supabase.table('matches').delete().eq('id', match_id).execute()

    return jsonify({"message": "Match deleted and user rejected"}), 200
