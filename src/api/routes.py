"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import jsonify, Blueprint
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/forgot', methods=['POST'])
def forgot_password():
    data=request.get_json()
    email=data.get('email')

    print("Solicitud de recuperacion recibida para:", email)

    if not email:
        print("Error: email no proporcionado.")
        return jsonify({"error": "el email es requerido"}),400
    
    try:
        supabase.auth.reset_password_for_email(email)
        return jsonify("Enviado"),200
    
    except Exception as e:
        print(" Error al enviar email de recuperación:", str(e))
        return jsonify({"error": "No se pudo enviar el email de recuperación", "details": 
str(e)}), 500


@api.route('/reset', methods=['POST'])
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