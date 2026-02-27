from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__)

# Temporary in-memory storage (replace with database in production)
users_db = {}

class User:
    def __init__(self, email, password, full_name):
        self.id = hash(email)
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.full_name = full_name
        self.created_at = datetime.now()
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'created_at': self.created_at.isoformat()
        }

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    return True, "Password is valid"

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Register a new user
    Request body:
    {
        "email": "user@example.com",
        "password": "SecurePass123",
        "full_name": "John Doe"
    }
    """
    try:
        data = request.get_json()
        
        # Validation
        if not data or not all(key in data for key in ['email', 'password', 'full_name']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        full_name = data['full_name'].strip()
        
        # Validate email
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if user already exists
        if email in users_db:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Validate password
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Validate full name
        if len(full_name) < 2:
            return jsonify({'error': 'Full name must be at least 2 characters'}), 400
        
        # Create new user
        user = User(email, password, full_name)
        users_db[email] = user
        
        # Generate tokens
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate user and return JWT tokens
    Request body:
    {
        "email": "user@example.com",
        "password": "SecurePass123"
    }
    """
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['email', 'password']):
            return jsonify({'error': 'Missing email or password'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Find user
        user = users_db.get(email)
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate tokens
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout user (invalidate token)
    Requires: Authorization header with Bearer token
    """
    try:
        current_user = get_jwt_identity()
        # In production, add token to blacklist
        return jsonify({'message': 'Logout successful'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token
    Requires: Authorization header with Bearer refresh token
    """
    try:
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        
        return jsonify({
            'message': 'Token refreshed successfully',
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """
    Verify if current token is valid
    Requires: Authorization header with Bearer token
    """
    try:
        current_user = get_jwt_identity()
        user = users_db.get(current_user)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'message': 'Token is valid',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Verification failed', 'details': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change user password
    Request body:
    {
        "current_password": "OldPass123",
        "new_password": "NewPass456"
    }
    """
    try:
        current_user = get_jwt_identity()
        user = users_db.get(current_user)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data or not all(key in data for key in ['current_password', 'new_password']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Verify current password
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        is_valid, message = validate_password(data['new_password'])
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Update password
        user.password_hash = generate_password_hash(data['new_password'])
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Password change failed', 'details': str(e)}), 500