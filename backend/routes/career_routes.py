from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os, json

def _get_db():
    from firebase_admin import firestore
    return firestore.client()

_DATA = os.path.join(os.path.dirname(__file__), '..', 'data')

career_bp = Blueprint('career', __name__)


def _compute_match(user_skills: list, required_skills: list) -> int:
    if not required_skills:
        return 0
    user_set = {s.lower() for s in user_skills}
    matched = sum(1 for s in required_skills if s.lower() in user_set)
    return round((matched / len(required_skills)) * 100)


def _gemini_career_guidance(career_title, match_pct, user_skills, gaps):
    key = os.getenv('GEMINI_API_KEY', '')
    if not key:
        return f"Strong match for {career_title}. Focus on closing skill gaps to reach {match_pct}%+ readiness."
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""Career: {career_title} | Match: {match_pct}%
User skills: {', '.join(user_skills[:10])}
Missing skills: {', '.join(gaps[:5])}

Write 2 sentences of personalized career guidance: why this role suits them and what one thing they should do next."""
        resp = model.generate_content(prompt)
        return resp.text.strip()
    except Exception as e:
        return f"You show good alignment with {career_title}. Consider closing key skill gaps to boost your match score."


@career_bp.route('', methods=['GET'])
@jwt_required()
def get_career_match():
    """Match user skills against career paths and return top 3 with guidance."""
    try:
        email = get_jwt_identity()
        db = _get_db()
        doc = db.collection('users').document(email).get()

        if not doc.exists:
            return jsonify({'error': 'User not found'}), 404

        data = doc.to_dict()
        profile = data.get('profile', {})
        skills_raw = data.get('dashboard', {}).get('skills', [])
        user_skills = [s.get('name', '') for s in skills_raw]

        with open(os.path.join(_DATA, 'career_paths.json')) as f:
            careers = json.load(f)

        matches = []
        for career in careers:
            required = career.get('requiredSkills', [])
            pct = _compute_match(user_skills, required)
            gaps = [s for s in required if s.lower() not in {u.lower() for u in user_skills}]
            matches.append({**career, 'matchPct': pct, 'gaps': gaps})

        # Sort by match percentage, return top 3
        matches.sort(key=lambda x: x['matchPct'], reverse=True)
        top3 = matches[:3]

        # Add Gemini guidance to each
        for m in top3:
            m['guidance'] = _gemini_career_guidance(
                m['title'], m['matchPct'], user_skills, m['gaps']
            )

        result = {
            'matches': top3,
            'topCareer': top3[0]['title'] if top3 else 'Full Stack Developer',
            'createdAt': datetime.utcnow().isoformat(),
        }

        db.collection('users').document(email).set({'career_match': result}, merge=True)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': 'Career match failed', 'details': str(e)}), 500
