from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models.user import User
from utils.jwt_helper import JWTHelper
import sys

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    """User login endpoint."""
    print("🔐 === LOGIN ENDPOINT CALLED ===")
    
    if request.method == 'OPTIONS':
        print("✅ OPTIONS request handled for login")
        return '', 200
    
    try:
        print("📥 Processing login request...")
        data = request.get_json()
        print(f"📋 Received data: {data}")
        
        if not data:
            print("❌ No data provided in request")
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        print(f"👤 Login attempt for email: {email}")
        
        if not email or not password:
            print("❌ Missing email or password")
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        print("🔍 Searching for user in database...")
        # Find user by email
        user = User.find_by_email(email)
        
        if not user:
            print(f"❌ User not found: {email}")
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401
        
        print(f"✅ User found: {email}")
        print("🔐 Checking password...")
        
        if not user.check_password(password):
            print("❌ Password check failed")
            return jsonify({
                'success': False,
                'message': 'Invalid credentials'
            }), 401
        
        print("✅ Password check passed")
        print("🎟️ Generating JWT token...")
        
        # Generate JWT token
        token = JWTHelper.encode_token(user.id, user.email, user.role)
        
        response_data = {
            'success': True,
            'message': 'Login successful',
            'data': {
                'token': token,
                'user': user.to_dict()
            }
        }
        
        print(f"✅ Login successful for user: {email}")
        print(f"🎟️ Token generated: {token[:20]}...")
        print("🔐 === LOGIN COMPLETED SUCCESSFULLY ===")
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"💥 LOGIN ERROR: {str(e)}")
        print("🔐 === LOGIN FAILED ===")
        return jsonify({
            'success': False,
            'message': f'Login failed: {str(e)}'
        }), 500

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
@cross_origin()
def signup():
    """User registration endpoint."""
    print("📝 === SIGNUP ENDPOINT CALLED ===")
    
    if request.method == 'OPTIONS':
        print("✅ OPTIONS request handled for signup")
        return '', 200
    
    try:
        print("📥 Processing signup request...")
        data = request.get_json()
        print(f"📋 Received data: {data}")
        
        if not data:
            print("❌ No data provided in request")
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        role = data.get('role', 'customer').strip()
        
        print(f"👤 Signup attempt for: {email}")
        print(f"📛 Name: {name}")
        print(f"📞 Phone: {phone}")
        print(f"🎭 Role: {role}")
        
        if not email or not password:
            print("❌ Missing email or password")
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        print("🔍 Checking if user already exists...")
        # Check if user already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            print(f"❌ User already exists: {email}")
            return jsonify({
                'success': False,
                'message': 'User already exists'
            }), 409
        
        print("✅ Email is available")
        
        # Validate role
        if role not in ['customer', 'admin']:
            role = 'customer'
            print(f"⚠️ Invalid role provided, defaulting to: {role}")
        
        print("👤 Creating new user...")
        # Create new user
        new_user = User.create_user(
            email=email,
            password=password,
            name=name if name else None,
            phone=phone if phone else None,
            role=role
        )
        
        if not new_user:
            print("💥 Failed to create user in database")
            return jsonify({
                'success': False,
                'message': 'Failed to create user'
            }), 500
        
        print(f"✅ User created successfully: {email}")
        print("🎟️ Generating JWT token...")
        
        # Generate JWT token
        token = JWTHelper.encode_token(new_user.id, new_user.email, new_user.role)
        
        response_data = {
            'success': True,
            'message': 'User created successfully',
            'data': {
                'token': token,
                'user': new_user.to_dict()
            }
        }
        
        print(f"✅ Signup successful for user: {email}")
        print(f"🎟️ Token generated: {token[:20]}...")
        print("📝 === SIGNUP COMPLETED SUCCESSFULLY ===")
        
        return jsonify(response_data), 201
        
    except Exception as e:
        print(f"💥 SIGNUP ERROR: {str(e)}")
        print("📝 === SIGNUP FAILED ===")
        return jsonify({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        }), 500
