**End-to-End AI-powered career guidance platform** that analyzes student profiles, validates skills through proctored assessments, identifies industry skill gaps, and generates personalized 8-week growth roadmaps.

---

## 🎯 **Problem Statement**
**ED009: Career Guidance & Skill Gap Analyzer**  
*60% of Indian graduates remain unemployed due to unaddressed skill gaps and lack of career clarity.*

**Our Solution:** Triple-validated career readiness engine with live proctoring, GitHub analysis, and industry benchmarking.

---

## 🏗️ **7-Module Architecture**

Module 1 → Auth + Profile Setup
↓
Module 2 → Interests + GitHub Scraping + Resume OCR
↓
Module 3 → AI Assessment + Webcam Proctoring ⭐
↓ ┬
M4 ↓ Skill Gap Radar M5 ↓ SWOT Analysis
↓ ┴
Module 6 → Career Matching (3 Paths)
↓
Module 7 → 8-Week Growth Roadmap + PDF Export

text

---

## ✨ **Key Innovations**

### **1. Triple Skill Validation**
Self-Reported → GitHub Verified → Assessment Validated

text
- **GitHub Scraping**: Playwright extracts tech stack from repos
- **Resume OCR**: PyMuPDF + GPT-4o parses achievements/publications  
- **Live Proctoring**: Webcam AI + tab detection (3-strike policy)

### **2. Industry Benchmarking**
- Real job market skill requirements
- Live demand heatmaps (Python +45%, Docker +30%)
- Regional salary data integration

### **3. Explainable AI**
- Every recommendation has "Why?" reasoning
- Transparent skill gap calculations
- LLM-powered descriptive analysis

---

## 🛠️ **Tech Stack**

| **Frontend** | **Backend** | **AI/ML** | **Database** | **Deployment** |
|-------------|-------------|-----------|-------------|---------------|
| React 18 + Vite | Flask + FastAPI | Gemini 2.0 Pro | PostgreSQL + Redis | Vercel + Render |
| Tailwind CSS | Celery (async) | OpenAI GPT-4o | Firebase (Auth) | Docker |
| shadcn/ui | PyMuPDF | MediaPipe | Firestore | NGINX |

| **Specialized** |
|----------------|
| `@monaco-editor/react` (Coding) |
| `react-webcam` (Proctoring) |
| `Recharts` + `D3.js` (Visuals) |
| `Playwright` (Scraping) |
| `react-pdf` (Roadmap Export) |

---

## 🚀 **Quick Start**

```bash
# Clone & Install
git clone https://github.com/yourteam/skillbridge-morpheus.git
cd skillbridge-morpheus

# Frontend
cd frontend
npm install
npm run dev

# Backend  
cd ../backend
pip install -r requirements.txt
flask run
