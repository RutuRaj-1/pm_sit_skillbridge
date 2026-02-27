from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os, json

def _get_db():
    from firebase_admin import firestore
    return firestore.client()

_DATA = os.path.join(os.path.dirname(__file__), '..', 'data')

gap_bp = Blueprint('gap', __name__)


def _level_to_score(level: str) -> int:
    return {'Beginner': 30, 'Intermediate': 60, 'Advanced': 90}.get(level, 40)


def _gemini_gap_explanation(user_skills, gaps, career):
    key = os.getenv('GEMINI_API_KEY', '')
    if not key:
        return "Enable GEMINI_API_KEY for AI-powered gap analysis."
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""You are a career coach. The user is targeting {career}.

Their skills: {json.dumps(user_skills)}
Skill gaps identified: {json.dumps(gaps)}

Write a concise 3-4 sentence analysis:
1. Acknowledge their existing strengths
2. Highlight the top 2 most critical gaps to close
3. Give one actionable improvement tip

Keep it direct and motivating."""
        resp = model.generate_content(prompt)
        return resp.text.strip()
    except Exception as e:
        return f"AI analysis unavailable: {e}"


@gap_bp.route('', methods=['GET'])
@jwt_required()
def get_gap_analysis():
    """Compare user skills vs industry benchmark for their career interest."""
    try:
        email = get_jwt_identity()
        db = _get_db()
        doc = db.collection('users').document(email).get()

        if not doc.exists:
            return jsonify({'error': 'User not found'}), 404

        data = doc.to_dict()
        profile = data.get('profile', {})
        career_interest = profile.get('careerInterest', 'Full Stack Developer')
        user_skills_raw = data.get('dashboard', {}).get('skills', [])

        # Map user skills to name→score
        user_skill_map = {
            s.get('name', ''): _level_to_score(s.get('level', 'Beginner'))
            for s in user_skills_raw
        }

        # Load benchmark
        with open(os.path.join(_DATA, 'industry_skills.json')) as f:
            benchmarks = json.load(f)

        # Find best matching role
        role_data = benchmarks.get(career_interest) or list(benchmarks.values())[0]
        industry_levels = role_data.get('levels', {})
        required_skills = role_data.get('skills', [])

        # Build radar data + gap cards
        radar_data, gaps, strengths = [], [], []
        for skill in required_skills:
            user_score = user_skill_map.get(skill, 0)
            industry_score = industry_levels.get(skill, 70)
            radar_data.append({
                'skill': skill,
                'user': user_score,
                'industry': industry_score,
            })
            diff = user_score - industry_score
            if diff < -20:
                gaps.append({'skill': skill, 'user': user_score, 'industry': industry_score,
                              'severity': 'critical' if diff < -40 else 'partial', 'gap': abs(diff)})
            elif diff >= 0:
                strengths.append({'skill': skill, 'user': user_score, 'industry': industry_score})

        llm_text = _gemini_gap_explanation(
            user_skill_map, [g['skill'] for g in gaps], career_interest
        )

        result = {
            'careerInterest': career_interest,
            'radarData': radar_data,
            'gaps': gaps,
            'strengths': strengths,
            'llmExplanation': llm_text,
            'overallMatch': max(0, 100 - round(len(gaps) / max(len(required_skills), 1) * 100)),
            'createdAt': datetime.utcnow().isoformat(),
        }

        # Persist
        db.collection('users').document(email).set({'gap_analysis': result}, merge=True)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': 'Gap analysis failed', 'details': str(e)}), 500
