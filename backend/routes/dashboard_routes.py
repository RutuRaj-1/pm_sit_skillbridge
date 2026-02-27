from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os

def _get_db():
    from firebase_admin import firestore
    return firestore.client()

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/skills', methods=['POST'])
@jwt_required()
def save_skills():
    """Save skills list. Body: { skills: [{ name, level, category }] }"""
    try:
        email = get_jwt_identity()
        data = request.get_json() or {}
        skills = data.get('skills', [])

        if not isinstance(skills, list):
            return jsonify({'error': 'skills must be a list'}), 400

        db = _get_db()
        db.collection('users').document(email).set({
            'dashboard': {
                'skills': skills,
                'skillsUpdatedAt': datetime.utcnow().isoformat(),
            }
        }, merge=True)

        return jsonify({'message': 'Skills saved', 'count': len(skills)}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to save skills', 'details': str(e)}), 500


@dashboard_bp.route('/repo', methods=['POST'])
@jwt_required()
def scrape_repo():
    """Scrape a GitHub repo and save it. Body: { url }"""
    try:
        email = get_jwt_identity()
        data = request.get_json() or {}
        url = data.get('url', '').strip()

        if not url or 'github.com' not in url:
            return jsonify({'error': 'A valid GitHub URL is required'}), 400

        from services.repo_scraper import scrape_github_repo
        result = scrape_github_repo(url)

        db = _get_db()
        doc = db.collection('users').document(email).get()
        existing = doc.to_dict() if doc.exists else {}
        repos = existing.get('dashboard', {}).get('repos', [])
        repos.insert(0, result)

        db.collection('users').document(email).set({
            'dashboard': {'repos': repos}
        }, merge=True)

        return jsonify({'message': 'Repo scraped', 'repo': result}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to scrape repo', 'details': str(e)}), 500


@dashboard_bp.route('/resume', methods=['POST'])
@jwt_required()
def upload_resume():
    """Parse an uploaded PDF resume. Multipart form with 'resume' field."""
    try:
        email = get_jwt_identity()

        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400

        file = request.files['resume']
        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are accepted'}), 400

        pdf_bytes = file.read()
        from services.resume_parser import parse_resume
        parsed = parse_resume(pdf_bytes, file.filename)

        db = _get_db()
        db.collection('users').document(email).set({
            'dashboard': {
                'resume': {
                    'fileName': file.filename,
                    'parsed': parsed,
                    'uploadedAt': datetime.utcnow().isoformat(),
                }
            }
        }, merge=True)

        return jsonify({'message': 'Resume parsed', 'parsed': parsed}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to parse resume', 'details': str(e)}), 500


@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get the full dashboard data for the authenticated user."""
    try:
        email = get_jwt_identity()
        db = _get_db()
        doc = db.collection('users').document(email).get()

        if not doc.exists:
            return jsonify({'dashboard': {}}), 200

        data = doc.to_dict()
        return jsonify({'dashboard': data.get('dashboard', {})}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard', 'details': str(e)}), 500
