"""
This module contains all the routes related to matches management, including getting and deleting matches.
"""
from flask import request, jsonify, Blueprint
from flask_cors import CORS

# Import the supabase client
from api.supabase import supabase
from api.user.chats.service import create_chat_for_match

matches = Blueprint('matches_api', __name__)

# Allow CORS requests to this API
CORS(matches)

# Supabase endpoints

# Get all matches for a user
@matches.route('/<user_id>', methods=['GET'])
def get_matches(user_id):
    response = supabase.table('matches').select(
        'id, created_at, user_1_id, user_2_id, '
        'user1:profiles!user_1_id(id, name, age, profile_pic, location, bio), '
        'user2:profiles!user_2_id(id, name, age, profile_pic, location, bio)'
    ).or_(f"user_1_id.eq.{user_id},user_2_id.eq.{user_id}").execute()

    matches_list = []
    for match in response.data:
        matched_user = match['user2'] if match['user_1_id'] == user_id else match['user1']
        if matched_user is None:
            continue
        matches_list.append({
            'match_id': match['id'],
            'matched_user': matched_user,
            'created_at': match['created_at']
        })

    return jsonify(matches_list), 200



@matches.route('/sync-chats', methods=['POST'])
def sync_chats():
    try:
        matches_response = supabase.table('matches').select('*').execute()
        print("Total matches:", len(matches_response.data))

        created = 0
        errors = []
        for match in matches_response.data:
            try:
                result = create_chat_for_match(match)
                print("Chat creado:", result)
                created += 1
            except Exception as e:
                error_msg = f"Match {match.get('id')}: {str(e)}"
                print("ERROR:", error_msg)
                errors.append(error_msg)

        return jsonify({
            "message": f"{created} chats sincronizados",
            "errors": errors
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400



@matches.route('/<match_id>', methods=['DELETE'])
def delete_match(match_id):
    data = request.get_json()
    current_user_id = data.get('user_id')

    match_response = supabase.table('matches').select('*').eq('id', match_id).execute()

    if not match_response.data:
        return jsonify({"error": "Match not found"}), 404

    match = match_response.data[0]
    other_user_id = match['user_2_id'] if match['user_1_id'] == current_user_id else match['user_1_id']

    supabase.table('rejections').insert({
        'user_id': current_user_id,
        'rejected_user_id': other_user_id
    }).execute()

    supabase.table('matches').delete().eq('id', match_id).execute()

    return jsonify({"message": "Match deleted and user rejected"}), 200