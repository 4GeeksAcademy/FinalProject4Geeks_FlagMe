"""
This module contains all the routes related to user management, including registration, login, and profile management. 
It uses the Supabase client to interact with the database and handle authentication.
"""
import re
import os

from flask import request, jsonify, Blueprint
from flask_cors import CORS
from supabase import create_client

# Import the supabase client
from api.supabase import supabase

user = Blueprint('user_api', __name__)

# Allow CORS requests to this API
CORS(user)

# Create a separate Supabase client with anon key to bypass RLS for fetching all profiles
supabase_anon_url = os.getenv("SUPABASE_URL")
supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
supabase_anon = None
if supabase_anon_url and supabase_anon_key:
    supabase_anon = create_client(supabase_anon_url, supabase_anon_key)

# Supabase endoints

# Get all profiles


@user.route('/', methods=['GET'])
def get_users():
    try:
        # Use anon client to bypass RLS filtering by current user
        client = supabase_anon if supabase_anon else supabase
        response = client.table('profiles').select('*').execute()
        # response may be an object with .data or a dict; handle both
        data = None
        if hasattr(response, 'data'):
            data = response.data
        elif isinstance(response, dict):
            data = response.get('data')
        else:
            data = response

        if data is None:
            data = []

        print(f'[DEBUG] Total users from Supabase: {len(data)}')
        for user in data:
            print(f'[DEBUG] User: id={user.get("id")}, name={user.get("name")}, email={user.get("email")}, is_active={user.get("is_active")}')

        return jsonify(data), 200
    except Exception as e:
        print('Error fetching profiles from Supabase:', e)
        return jsonify({"error": str(e)}), 500

# Create a new profile
@user.route('/', methods=['POST'])
def create_user():
    data = request.get_json()  # Get the JSON data of the frontend request
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    email = (data.get('email') or '').strip()
    password = data.get('password')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not _is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    auth_response = supabase.auth.sign_up(
        {"email": email, "password": password})

    if auth_response.user is None:
        return jsonify({"error": "No se pudo registrar el usuario"}), 400

    # Insertar en la tabla Usuario usando el UUID de Supabase
    usuario_data = {'id': auth_response.user.id, 'email': email}

    try:
        insert_response = supabase.table(
            'profiles').upsert(usuario_data).execute()
        print("Insert response: ", insert_response)
        return jsonify(insert_response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Login


@user.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get the JSON data of the frontend request
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    email = (data.get('email') or '').strip()
    password = data.get('password')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not _is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    response = supabase.auth.sign_in_with_password(
        {"email": email, "password": password})

    if response.user is None:
        return jsonify({"error": "User not found or incorrect password"}), 400

    """print(response.user)"""
    return jsonify({'message': 'Login successful', 'user': {'id': response.user.id, 'email': response.user.email, 'user_metadata': response.user.user_metadata}, }), 200


def _is_valid_email(email):
    # Email check; avoids malformed emails.
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    return re.match(pattern, email) is not None

# Get profile by ID


@user.route('/<string:user_id>', methods=['GET'])
def get_user(user_id):
    response = supabase.table('profiles').select(
        '*').eq('id', user_id).execute()
    return jsonify(response.data), 200

# Get feed of profiles for a user, excluding already liked, matched, or rejected users


@user.route('/<string:user_id>/feed', methods=['GET'])
def get_feed_users(user_id):
    try:
        excluded_ids = {user_id}

        likes_response = supabase.table('likes').select(
            'to_user_id').eq('from_user_id', user_id).execute()
        for like in likes_response.data:
            excluded_ids.add(like['to_user_id'])

        matches_response = supabase.table('matches').select(
            'user_1_id, user_2_id').or_(f"user_1_id.eq.{user_id},user_2_id.eq.{user_id}").execute()
        for match in matches_response.data:
            if match['user_1_id'] == user_id:
                excluded_ids.add(match['user_2_id'])
            elif match['user_2_id'] == user_id:
                excluded_ids.add(match['user_1_id'])

        rejections_response = supabase.table('rejections').select(
            'user_id, rejected_user_id').or_(f"user_id.eq.{user_id},rejected_user_id.eq.{user_id}").execute()
        for rejection in rejections_response.data:
            if rejection['user_id'] == user_id:
                excluded_ids.add(rejection['rejected_user_id'])
            elif rejection['rejected_user_id'] == user_id:
                excluded_ids.add(rejection['user_id'])

        profiles_response = supabase.table('profiles').select('*').execute()
        feed_profiles = [
            profile for profile in profiles_response.data
            if profile.get('id') not in excluded_ids
        ]

        return jsonify(feed_profiles), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Update a profile by ID


@user.route('/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    allowed_fields = ['name', 'age', 'location', 'bio',
                      'languages', 'interests', 'profile_pic']

    data = request.get_json()  # Get the JSON data of the frontend request
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    # Filter the data to only include allowed fields
    filtered_data = {key: value for key,
                     value in data.items() if key in allowed_fields}
    if not filtered_data:
        return jsonify({"error": "No updatable fields provided"}), 400
    try:
        response = supabase.table('profiles').update(
            filtered_data).eq('id', user_id).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Delete a profile by ID


@user.route('/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        response = supabase.table('profiles').delete().eq(
            'id', user_id).execute()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
