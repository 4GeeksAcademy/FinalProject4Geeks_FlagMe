from api.supabase import supabase

def create_chat_for_match(match_row):
    match_id = match_row.get('id')
    user_1_id = match_row.get('user_1_id')
    user_2_id = match_row.get('user_2_id')

    if not match_id or not user_1_id or not user_2_id:
        raise ValueError('Invalid match data to create chat')

    existing_chat_response = supabase.table('chats').select(
        'id, match_id, user_1_id, user_2_id, created_at, '
        'last_message_id, last_message_text, last_message_sender_id, last_message_at'
    ).eq('match_id', match_id).limit(1).execute()

    if existing_chat_response.data:
        return existing_chat_response.data[0]

    # Keep last message references empty until the first message exists.
    chat_data = {
        'match_id': match_id,
        'user_1_id': user_1_id,
        'user_2_id': user_2_id,
        'last_message_id': None,
        'last_message_text': None,
        'last_message_sender_id': None,
        'last_message_at': None
    }

    chat_response = supabase.table('chats').insert(chat_data).execute()
    if not chat_response.data:
        raise ValueError('Chat could not be created')

    return chat_response.data[0]


def get_chat_messages(chat_id, limit=50, before=None):
    chat_response = supabase.table('chats').select(
        'id, user_1_id, user_2_id'
    ).eq('id', chat_id).limit(1).execute()

    if not chat_response.data:
        raise ValueError('Chat not found')

    query = supabase.table('messages').select(
        'id, chat_id, sender_id, content, created_at, read_at'
    ).eq('chat_id', chat_id)

    if before:
        query = query.lt('created_at', before)

    messages_response = query.order(
        'created_at', desc=True).limit(limit).execute()
    messages = messages_response.data or []
    messages.reverse()

    return messages



def create_chat_message(chat_id, sender_id, content):
    chat_response = supabase.table('chats').select(
        'id, user_1_id, user_2_id'
    ).eq('id', chat_id).limit(1).execute()

    if not chat_response.data:
        raise LookupError('Chat not found')

    chat_row = chat_response.data[0]
    if sender_id not in [chat_row.get('user_1_id'), chat_row.get('user_2_id')]:
        raise PermissionError('Sender does not belong to this chat')

    message_payload = {
        'chat_id': chat_id,
        'sender_id': sender_id,
        'content': content
    }

    message_response = supabase.table('messages').insert(message_payload).execute()
    if not message_response.data:
        raise ValueError('Message could not be created')

    created_message = message_response.data[0]

    supabase.table('chats').update({
        'last_message_id': created_message.get('id'),
        'last_message_text': created_message.get('content'),
        'last_message_sender_id': created_message.get('sender_id'),
        'last_message_at': created_message.get('created_at')
    }).eq('id', chat_id).execute()

    return created_message