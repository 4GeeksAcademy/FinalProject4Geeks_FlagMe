"""
This module contains all the routes related to user management, including registration, login, and profile management. 
It uses the Supabase client to interact with the database and handle authentication.
"""
import re
import os

from flask import request, jsonify, Blueprint
from flask_cors import CORS
from supabase import create_client

# Import the supabase clients
from api.supabase import supabase, supabase_admin

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
        response = supabase.table('profiles').select('*').execute()
        data = response.data
        print(response)

        return jsonify(data), 200
    except Exception as e:
        print('Error fetching profiles from Supabase:', e)
        return jsonify({"error": str(e)}), 500

# Create a new profile


@user.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    email = (data.get('email') or '').strip()
    password = data.get('password')

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    auth_response = supabase.auth.sign_up(
        {"email": email, "password": password})

    if auth_response.user is None:
        return jsonify({"error": "No se pudo registrar el usuario"}), 400

    usuario_data = {'id': auth_response.user.id, 'email': email}

    try:
        # Use supabase_admin (service role, session never overwritten by sign_up)
        # so RLS is bypassed for the profile insert.
        insert_response = supabase_admin.table(
            'profiles').upsert(usuario_data).execute()
        print("Insert response: ", insert_response)
        return jsonify(insert_response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        supabase.auth.sign_out()


# Login
@user.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request body"}), 400

    email = (data.get('email') or '').strip()
    password = data.get('password')

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    try:
        response = supabase.auth.sign_in_with_password(
            {"email": email, "password": password})
        if response.user is None:
            return jsonify({"error": "User not found or incorrect password"}), 400

        # Fetch the complete profile from the profiles table
        profile_response = supabase.table('profiles').select(
            '*').eq('id', response.user.id).execute()
        profile_data = profile_response.data[0] if profile_response.data else {
        }

        # Merge auth user data with profile data
        user_data = {
            'id': response.user.id,
            'email': response.user.email,
            'user_metadata': response.user.user_metadata,
            **profile_data  # Include all profile fields
        }
        return jsonify({
            'message': 'Login successful',
            'user': user_data,
            'token': response.session.access_token
        }), 200
    finally:
        supabase.auth.sign_out()

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


@user.route('/forgot', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    print("Solicitud de recuperacion recibida para:", email)

    if not email:
        print("Error: email no proporcionado.")
        return jsonify({"error": "el email es requerido"}), 400

    try:
        supabase.auth.reset_password_for_email(email)
        return jsonify("Enviado"), 200

    except Exception as e:
        print(" Error al enviar email de recuperación:", str(e))
        return jsonify({"error": "No se pudo enviar el email de recuperación", "details":
                        str(e)}), 500


@user.route('/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    new_password = data.get('new_password')
    # token que viene del email de Supabase
    access_token = data.get('access_token')
    email = data.get('email')
    if not new_password or not access_token:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

    try:
        print(type(access_token))
        # Usar el access_token para autenticar temporalmente al usuario
        user_response = supabase.auth.verify_otp({
            "email": email,
            "token": access_token,
            "type": "recovery"
        })

        # Actualizar la contraseña
        response = supabase.auth.update_user({"password": new_password})

        supabase.auth.sign_out()

        return jsonify({
            "message": "Contraseña actualizada correctamente",
            "supabase_response": str(response)
        }), 200

    except Exception as e:

        return jsonify({
            "error": "No se pudo restablecer la contraseña",
            "details": str(e)
        }), 500
