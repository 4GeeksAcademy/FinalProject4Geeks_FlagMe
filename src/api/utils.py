from flask import jsonify, url_for, request
from functools import wraps
import jwt
import os


class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def require_auth(f):
    """Decorator to require authentication token in Authorization header"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Check for Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                # Extract token from "Bearer <token>"
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({"error": "Invalid authorization header format. Use: Bearer <token>"}), 401

        if not token:
            return jsonify({"error": "Authorization token is required"}), 401

        try:
            # Verify token with Supabase JWT secret
            secret = os.getenv("SUPABASE_JWT_SECRET")
            if not secret:
                print(
                    "[WARNING] SUPABASE_JWT_SECRET not configured. Skipping token validation.")
                # For development, allow requests without proper JWT secret
                # In production, this should fail
                if os.getenv("FLASK_ENV") == "production":
                    return jsonify({"error": "Server configuration error"}), 500
                request.user_id = "unknown"
            else:
                payload = jwt.decode(token, secret, algorithms=["HS256"])
                # 'sub' contains the user ID in Supabase JWT
                request.user_id = payload.get('sub')

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            print(f"[ERROR] Token validation failed: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 401

        return f(*args, **kwargs)

    return decorated_function


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" +
                         y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"
