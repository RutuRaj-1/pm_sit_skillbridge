"""
Resume parser — extracts structured info from a PDF resume using PyMuPDF + Gemini.
"""

import os
import io

def parse_resume(pdf_bytes: bytes, filename: str = 'resume.pdf') -> dict:
    """
    Parse a PDF resume and return structured data.

    Returns:
        { skills, achievements, experience, publications, summary }
    """
    # ── Step 1: Extract raw text with PyMuPDF ──────────────────────────────
    raw_text = ''
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype='pdf')
        for page in doc:
            raw_text += page.get_text()
        doc.close()
    except Exception as e:
        raw_text = f'[PDF text extraction failed: {e}]'

    if not raw_text.strip():
        return {
            'skills': [],
            'achievements': [],
            'experience': [],
            'publications': [],
            'summary': 'Could not extract text from this PDF.',
        }

    # ── Step 2: Call Gemini to structure the text ──────────────────────────
    gemini_key = os.getenv('GEMINI_API_KEY', '')
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = f"""You are a resume parser. Extract structured information from the resume text below.

Return ONLY a valid JSON object with these keys:
- "skills": list of technical skills mentioned (strings, max 20)
- "achievements": list of notable achievements or projects (strings, max 10)
- "experience": list of work/internship experiences (strings, max 8)
- "publications": list of publications or papers if any (strings)
- "summary": a 2-sentence professional summary

Resume Text:
---
{raw_text[:4000]}
---

JSON only, no markdown:"""

            response = model.generate_content(prompt)
            text = response.text.strip()
            # Remove markdown code fences if present
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
            import json
            parsed = json.loads(text.strip())
            return parsed
        except Exception as e:
            pass  # fall back to simple extraction below

    # ── Step 3: Fallback — simple keyword extraction ─────────────────────
    tech_keywords = [
        'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB',
        'C++', 'C#', 'TypeScript', 'Django', 'Flask', 'Docker', 'AWS', 'Git',
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Linux',
        'HTML', 'CSS', 'Express', 'Spring', 'Kubernetes', 'Redis',
    ]
    found_skills = [kw for kw in tech_keywords if kw.lower() in raw_text.lower()]

    return {
        'skills': found_skills,
        'achievements': [],
        'experience': [],
        'publications': [],
        'summary': raw_text[:300].replace('\n', ' ').strip(),
    }
