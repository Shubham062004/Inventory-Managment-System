from functools import wraps
from flask import request, jsonify, current_app
from utils.jwt_helper import JWTHelper

def token_required(f):
    """Decorator to require valid JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            token = JWTHelper.extract_token_from_header(auth_header)
        
        if not token:
            return jsonify({
                'success': False,
                'message': 'Token is missing'
            }), 401
        
        payload = JWTHelper.decode_token(token)
        
        if 'error' in payload:
            return jsonify({
                'success': False,
                'message': payload['error']
            }), 401
        
        # Add user info to request context
        request.current_user = payload
        return f(*args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator to require admin role."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'current_user'):
            return jsonify({
                'success': False,
                'message': 'Authentication required'
            }), 401
        
        if request.current_user.get('role') != 'admin':
            return jsonify({
                'success': False,
                'message': 'Admin access required'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated
