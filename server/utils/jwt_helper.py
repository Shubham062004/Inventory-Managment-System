import jwt
from datetime import datetime, timedelta
from flask import current_app
from functools import wraps

class JWTHelper:
    @staticmethod
    def encode_token(user_id, email, role):
        """Generate JWT token for user."""
        try:
            payload = {
                'exp': datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
                'iat': datetime.utcnow(),
                'sub': user_id,
                'email': email,
                'role': role
            }
            
            token = jwt.encode(
                payload,
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            return token
        except Exception as e:
            return str(e)
    
    @staticmethod
    def decode_token(token):
        """Decode JWT token and return payload."""
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            return payload
        except jwt.ExpiredSignatureError:
            return {'error': 'Token has expired'}
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}
    
    @staticmethod
    def extract_token_from_header(auth_header):
        """Extract token from Authorization header."""
        if auth_header and auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1]
        return None
