from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

def _get_db():
    from firebase_admin import firestore
    return firestore.client()

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/setup', methods=['POST'])
@jwt_required()
def setup_profile():
    """Save / update user profile. Body: { college, branch, year, careerInterest, targetCompany, bio }"""
    try:
        email = get_jwt_identity()
        data = request.get_json() or {}

        if not data.get('college') or not data.get('branch') or not data.get('careerInterest'):
            return jsonify({'error': 'college, branch and careerInterest are required'}), 400

        profile = {
            'college': data.get('college', '').strip(),
            'branch': data.get('branch', '').strip(),
            'year': data.get('year', ''),
            'careerInterest': data.get('careerInterest', '').strip(),
            'targetCompany': data.get('targetCompany', '').strip(),
            'bio': data.get('bio', '').strip(),
            'updatedAt': datetime.utcnow().isoformat(),
        }

        db = _get_db()
        db.collection('users').document(email).set({'profile': profile}, merge=True)

        return jsonify({'message': 'Profile saved', 'profile': profile}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to save profile', 'details': str(e)}), 500


@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    """Fetch the authenticated user's full profile."""
    try:
        email = get_jwt_identity()
        db = _get_db()
        doc = db.collection('users').document(email).get()

        if not doc.exists:
            return jsonify({'error': 'User not found'}), 404

        data = doc.to_dict()
        return jsonify({
            'email': email,
            'full_name': data.get('full_name', ''),
            'profile': data.get('profile', {}),
            'dashboard': data.get('dashboard', {}),
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch profile', 'details': str(e)}), 500
