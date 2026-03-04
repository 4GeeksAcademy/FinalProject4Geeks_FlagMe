"""
This module contains all the routes related to chats management...
"""
from flask import jsonify, Blueprint, request
from flask_cors import CORS

# Import the supabase client
from api.supabase import supabase
from api.user.chats.service import get_chat_messages, create_chat_message

chats = Blueprint('chats_api', __name__)

# Allow CORS requests to this API
CORS(chats)

# Supabase endpoints

# Get all chats for a user


@chats.route('/<user_id>', methods=['GET'])
def get_chats(user_id):
    try:
        # Get all chats where the user is either user_1_id or user_2_id
        chats_response = supabase.table('chat').select(
            'id, match_id, user_1_id, user_2_id, created_at, '
            'last_message_id, last_message_text, last_message_sender_id, last_message_at'
        ).or_(f"user_1_id.eq.{user_id},user_2_id.eq.{user_id}").execute()

        # Transform response to include matched user details
        chat_rows = chats_response.data or []
        if not chat_rows:
            return jsonify([]), 200

        # Get unique other user IDs from the chats
        other_user_ids = []
        for chat_row in chat_rows:
            other_user_id = chat_row['user_2_id'] if chat_row['user_1_id'] == user_id else chat_row['user_1_id']
            if other_user_id and other_user_id not in other_user_ids:
                other_user_ids.append(other_user_id)

        # Fetch profiles of the other users in a single query
        profiles_response = supabase.table('profiles').select(
            'id, name, age, profile_pic, location, bio'
        ).in_('id', other_user_ids).execute()
        profiles_map = {profile['id']: profile for profile in (
            profiles_response.data or [])}

        # Build the final payload combining chat and matched user details
        chats_payload = []
        for chat_row in chat_rows:
            other_user_id = chat_row['user_2_id'] if chat_row['user_1_id'] == user_id else chat_row['user_1_id']
            matched_user = profiles_map.get(other_user_id)
            if matched_user is None:
                continue

            chats_payload.append({
                'chat_id': chat_row['id'],
                'match_id': chat_row.get('match_id'),
                'matched_user': matched_user,
                'last_message': {
                    'id': chat_row.get('last_message_id'),
                    'text': chat_row.get('last_message_text'),
                    'sender_id': chat_row.get('last_message_sender_id'),
                    'created_at': chat_row.get('last_message_at')
                },
                'created_at': chat_row.get('created_at')
            })

        # Sort chats by last message timestamp (or chat creation time if no messages)
        chats_payload.sort(
            key=lambda chat: chat['last_message']['created_at'] or chat['created_at'] or '',
            reverse=True
        )

        return jsonify(chats_payload), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Get all messages for a chat (limit and before timestamp)


@chats.route('/<chat_id>/messages', methods=['GET'])
def get_messages(chat_id):
    try:
        limit_raw = request.args.get('limit', '50')
        before = request.args.get('before')

        try:
            limit = int(limit_raw)
        except ValueError:
            return jsonify({'error': 'limit must be an integer'}), 400

        if limit <= 0 or limit > 200:
            return jsonify({'error': 'limit must be between 1 and 200'}), 400

        messages = get_chat_messages(
            chat_id=chat_id, limit=limit, before=before)
        return jsonify(messages), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Create a new message in a chat (with sender validation and content length check)


@chats.route('/<chat_id>/messages', methods=['POST'])
def post_message(chat_id):
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid request body'}), 400

    sender_id = data.get('sender_id')
    content = (data.get('content') or '').strip()

    if not sender_id:
        return jsonify({'error': 'sender_id is required'}), 400

    if not content:
        return jsonify({'error': 'content is required'}), 400

    if len(content) > 2000:
        return jsonify({'error': 'content is too long (max 2000 chars)'}), 400

    try:
        created_message = create_chat_message(
            chat_id=chat_id,
            sender_id=sender_id,
            content=content
        )
        return jsonify({
            'message': 'Message created successfully',
            'data': created_message
        }), 201
    except LookupError as e:
        return jsonify({'error': str(e)}), 404
    except PermissionError as e:
        return jsonify({'error': str(e)}), 403
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400
