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

# Get all users
@api.route('/users', methods=['GET'])
def get_users():
    response = supabase.table('User').select('*').execute()
    return jsonify(response.data), 200

# Create a new user
@api.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()  # Get the JSON data of the frontend request

    try:
        response = supabase.table('User').insert(data).execute()
        return jsonify(response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get user by ID
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    response = supabase.table('User').select('*').eq('id', user_id).execute()
    return jsonify(response.data), 200

# Delete a user by ID
@api.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        response = supabase.table('User').delete().eq('id', user_id).execute()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
