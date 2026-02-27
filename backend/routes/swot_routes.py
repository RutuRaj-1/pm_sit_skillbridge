from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os, json

def _get_db():
    from firebase_admin import firestore
    return firestore.client()

_DATA = os.path.join(os.path.dirname(__file__), '..', 'data')

swot_bp = Blueprint('swot', __name__)


def _gemini_swot(profile, skill_names, gaps, strengths, career):
    key = os.getenv('GEMINI_API_KEY', '')
    if not key:
        return {
            'strengths': ['Strong technical foundation', 'Motivated learner'],
            'weaknesses': ['Skill gaps in key areas', 'Limited industry experience'],
            'opportunities': ['Growing tech industry', 'Online learning resources'],
            'threats': ['Competitive job market', 'Rapid tech change'],
            'llmAnalysis': 'Enable GEMINI_API_KEY for detailed AI SWOT analysis.'
        }
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""Generate a concise SWOT analysis for a student with this profile:
Career Goal: {career}
Skills: {', '.join(skill_names[:15])}
Skill Strengths: {', '.join([s['skill'] for s in strengths[:5]])}
Skill Gaps: {', '.join(gaps[:5])}
College: {profile.get('college', 'Unknown')}
Branch: {profile.get('branch', 'Unknown')}

Return ONLY valid JSON:
{{
  "strengths": ["point1", "point2", "point3", "point4"],
  "weaknesses": ["point1", "point2", "point3", "point4"],
  "opportunities": ["point1", "point2", "point3", "point4"],
  "threats": ["point1", "point2", "point3", "point4"],
  "llmAnalysis": "2-3 sentence overall assessment"
}}
JSON only, no markdown."""
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        if text.startswith('```'):
            text = text.split('```')[1]
            if text.startswith('json'): text = text[4:]
        return json.loads(text.strip())
    except Exception as e:
        return {
            'strengths': ['Technical skills in progress', 'Academic background'],
            'weaknesses': [f'Gaps in {gaps[0] if gaps else "core skills"}', 'Needs more projects'],
            'opportunities': ['AI/ML industry growth', 'Remote work accessible'],
            'threats': ['Competitive market', 'Rapid technology shifts'],
            'llmAnalysis': f'SWOT generated with fallback data. AI error: {e}'
        }


@swot_bp.route('', methods=['GET'])
@jwt_required()
def get_swot():
    """Generate SWOT analysis from all user data."""
    try:
        email = get_jwt_identity()
        db = _get_db()
        doc = db.collection('users').document(email).get()

        if not doc.exists:
            return jsonify({'error': 'User not found'}), 404

        data = doc.to_dict()
        profile = data.get('profile', {})
        career = profile.get('careerInterest', 'Full Stack Developer')
        skills_raw = data.get('dashboard', {}).get('skills', [])
        skill_names = [s.get('name', '') for s in skills_raw]
        gap_data = data.get('gap_analysis', {})
        gaps = [g['skill'] for g in gap_data.get('gaps', [])]
        strengths = gap_data.get('strengths', [])

        swot = _gemini_swot(profile, skill_names, gaps, strengths, career)
        swot['createdAt'] = datetime.utcnow().isoformat()

        db.collection('users').document(email).set({'swot': swot}, merge=True)
        return jsonify(swot), 200

    except Exception as e:
        return jsonify({'error': 'SWOT generation failed', 'details': str(e)}), 500
