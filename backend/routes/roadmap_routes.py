from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os, json

def _get_db():
    from firebase_admin import firestore
    return firestore.client()

roadmap_bp = Blueprint('roadmap', __name__)


def _gemini_roadmap(career, user_skills, gaps, name):
    key = os.getenv('GEMINI_API_KEY', '')
    if not key:
        return _fallback_roadmap(career, gaps)
    try:
        import google.generativeai as genai
        genai.configure(api_key=key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""Create a personalised 12-week learning roadmap for {name or 'a student'}.
Career Goal: {career}
Current Skills: {', '.join(user_skills[:12])}
Top Skill Gaps: {', '.join(gaps[:6])}

Return ONLY valid JSON — an array of 12 week objects:
[
  {{
    "week": 1,
    "theme": "Foundation",
    "skillsFocus": ["Skill1", "Skill2"],
    "tasks": ["Complete X course", "Build Y mini-project"],
    "resources": ["resource1", "resource2"],
    "milestone": "Milestone description"
  }},
  ...12 items total
]
JSON only, no markdown, no extra text."""
        resp = model.generate_content(prompt)
        text = resp.text.strip()
        if text.startswith('```'):
            text = text.split('```')[1]
            if text.startswith('json'): text = text[4:]
        weeks = json.loads(text.strip())
        return weeks
    except Exception as e:
        return _fallback_roadmap(career, gaps)


def _fallback_roadmap(career, gaps):
    themes = ['Foundation', 'Core Skills', 'Deep Dive', 'Project Building',
              'Advanced Topics', 'Real Projects', 'System Design', 'Portfolio',
              'Interview Prep', 'Mock Interviews', 'Final Projects', 'Launch Ready']
    focal_skills = gaps[:2] if gaps else ['Core Skills', 'Problem Solving']
    return [
        {
            'week': i + 1,
            'theme': themes[i],
            'skillsFocus': focal_skills,
            'tasks': [f'Complete {themes[i]} module on Udemy/Coursera', f'Build a {themes[i].lower()} project'],
            'resources': ['Udemy', 'LeetCode', 'GitHub'],
            'milestone': f'Complete {themes[i]} phase'
        }
        for i in range(12)
    ]


@roadmap_bp.route('', methods=['GET'])
@jwt_required()
def get_roadmap():
    """Generate a 12-week personalised roadmap from all user data."""
    try:
        email = get_jwt_identity()
        db = _get_db()
        doc = db.collection('users').document(email).get()

        if not doc.exists:
            return jsonify({'error': 'User not found'}), 404

        data = doc.to_dict()
        profile = data.get('profile', {})
        career = data.get('career_match', {}).get('topCareer') or profile.get('careerInterest', 'Full Stack Developer')
        skills_raw = data.get('dashboard', {}).get('skills', [])
        user_skills = [s.get('name', '') for s in skills_raw]
        gaps = [g['skill'] for g in data.get('gap_analysis', {}).get('gaps', [])]
        name = data.get('full_name', '')

        weeks = _gemini_roadmap(career, user_skills, gaps, name)

        result = {
            'career': career,
            'weeks': weeks,
            'totalWeeks': len(weeks),
            'createdAt': datetime.utcnow().isoformat(),
        }

        db.collection('users').document(email).set({'roadmap': result}, merge=True)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': 'Roadmap generation failed', 'details': str(e)}), 500
