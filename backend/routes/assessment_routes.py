from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os
import json

def _get_db():
    from firebase_admin import firestore
    return firestore.client()

assessment_bp = Blueprint('assessment', __name__)


def _generate_questions_with_gemini(skill: str) -> list:
    """Use Gemini to generate 5 MCQ + 2 code questions for a given skill."""
    gemini_key = os.getenv('GEMINI_API_KEY', '')
    if not gemini_key:
        raise RuntimeError('GEMINI_API_KEY not set')

    import google.generativeai as genai
    genai.configure(api_key=gemini_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""Generate a technical assessment for skill: "{skill}".

Create exactly 7 questions:
- Questions 1-5: Multiple Choice Questions (MCQ)
- Questions 6-7: Coding/Subjective questions

Return ONLY a valid JSON array with this structure:
[
  {{
    "id": 1,
    "type": "mcq",
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "correct": 0
  }},
  ...
  {{
    "id": 6,
    "type": "code",
    "question": "Write a function that ...",
    "language": "{skill.lower() if skill.lower() in ['python','java','javascript','c++'] else 'python'}",
    "starterCode": "def solution():\\n    pass"
  }}
]

Make questions appropriate for intermediate level. JSON only, no markdown."""

    response = model.generate_content(prompt)
    text = response.text.strip()
    if text.startswith('```'):
        text = text.split('```')[1]
        if text.startswith('json'):
            text = text[4:]
    return json.loads(text.strip())


FALLBACK_QUESTIONS = [
    {"id": 1, "type": "mcq", "question": "Which data structure uses LIFO?",
     "options": ["Queue", "Stack", "Tree", "Graph"], "correct": 1},
    {"id": 2, "type": "mcq", "question": "What is the time complexity of binary search?",
     "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"], "correct": 1},
    {"id": 3, "type": "mcq", "question": "Which keyword is used to create a class in Python?",
     "options": ["def", "class", "struct", "type"], "correct": 1},
    {"id": 4, "type": "mcq", "question": "What does REST stand for?",
     "options": ["Representational State Transfer", "Remote Endpoint State Tool",
                 "Real-time Event System Transfer", "Resource Exchange State Transfer"], "correct": 0},
    {"id": 5, "type": "mcq", "question": "Which of these is NOT a Python data type?",
     "options": ["list", "tuple", "array", "dict"], "correct": 2},
    {"id": 6, "type": "code", "question": "Write a function to reverse a string without using built-in reverse.",
     "language": "python", "starterCode": "def reverse_string(s: str) -> str:\n    # Your code here\n    pass"},
    {"id": 7, "type": "code", "question": "Implement a function to check if a number is prime.",
     "language": "python", "starterCode": "def is_prime(n: int) -> bool:\n    # Your code here\n    pass"},
]


@assessment_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_assessment():
    """Generate 5 MCQ + 2 code questions for a skill. Body: { skill }"""
    try:
        email = get_jwt_identity()
        data = request.get_json() or {}
        skill = data.get('skill', 'Python').strip()

        try:
            questions = _generate_questions_with_gemini(skill)
        except Exception as e:
            print(f"Gemini generation failed: {e}, using fallback questions")
            questions = FALLBACK_QUESTIONS

        # Store assessment in Firestore
        db = _get_db()
        assessment_id = f"{email}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        db.collection('users').document(email).collection('assessments').document(assessment_id).set({
            'skill': skill,
            'questions': questions,
            'createdAt': datetime.utcnow().isoformat(),
            'terminated': False,
            'submitted': False,
        })

        return jsonify({
            'assessmentId': assessment_id,
            'skill': skill,
            'questions': questions,
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to generate assessment', 'details': str(e)}), 500


@assessment_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_assessment():
    """Submit answers. Body: { assessmentId, answers: { questionId: answer }, terminated }"""
    try:
        email = get_jwt_identity()
        data = request.get_json() or {}
        assessment_id = data.get('assessmentId')
        answers = data.get('answers', {})
        terminated = data.get('terminated', False)

        if not assessment_id:
            return jsonify({'error': 'assessmentId is required'}), 400

        db = _get_db()
        doc_ref = db.collection('users').document(email).collection('assessments').document(assessment_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({'error': 'Assessment not found'}), 404

        assessment = doc.to_dict()
        questions = assessment.get('questions', [])

        # Grade MCQs
        score = 0
        total_mcq = 0
        for q in questions:
            if q.get('type') == 'mcq':
                total_mcq += 1
                q_id = str(q['id'])
                user_answer = answers.get(q_id)
                if user_answer is not None and int(user_answer) == q.get('correct'):
                    score += 1

        mcq_percentage = round((score / total_mcq) * 100) if total_mcq else 0

        doc_ref.update({
            'answers': answers,
            'score': score,
            'totalMcq': total_mcq,
            'mcqPercentage': mcq_percentage,
            'terminated': terminated,
            'submitted': True,
            'submittedAt': datetime.utcnow().isoformat(),
        })

        return jsonify({
            'message': 'Assessment submitted',
            'score': score,
            'totalMcq': total_mcq,
            'mcqPercentage': mcq_percentage,
            'terminated': terminated,
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to submit assessment', 'details': str(e)}), 500
