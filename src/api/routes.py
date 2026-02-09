"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

# Import the supabase client
from api.supabase import supabase

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Supabase endoints

# Get all profiles


@api.route('/users', methods=['GET'])
def get_users():
    response = supabase.table('profiles').select('*').execute()
    return jsonify(response.data), 200


# Create a new profile
@api.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()  # Get the JSON data of the frontend request

    auth_response = supabase.auth.sign_up(
        {"email": data['email'], "password": data['password']})

    if auth_response.user is None:
        return jsonify({"error": "No se pudo registrar el usuario"}), 400

    # Insertar en la tabla Usuario usando el UUID de Supabase
    usuario_data = {'id': auth_response.user.id, 'email': data['email']}

    try:
        insert_response = supabase.table(
            'profiles').upsert(usuario_data).execute()
        print("Insert response: ", insert_response)
        return jsonify(insert_response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Login


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get the JSON data of the frontend request

    response = supabase.auth.sign_in_with_password(
        {"email": data['email'], "password": data['password']})

    if response.user is None:
        return jsonify({"error": "No se pudo registrar el usuario"}), 400

    print(response.user)
    return jsonify({'message': 'Login successful', 'user': {'id': response.user.id, 'email': response.user.email, 'user_metadata': response.user.user_metadata}, }), 200

# Get profile by ID


@api.route('/user/<string:user_id>', methods=['GET'])
def get_user(user_id):
    response = supabase.table('profiles').select(
        '*').eq('id', user_id).execute()
    return jsonify(response.data), 200

# Update a profile by ID


@api.route('/user/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    allowed_fields = ['name', 'location', 'bio',
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


@api.route('/user/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        response = supabase.table('profiles').delete().eq(
            'id', user_id).execute()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
