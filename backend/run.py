"""
SkillBridge API Server — entry point
Flask + Firebase Admin SDK (Firestore) + JWT
"""

import os
import asyncio
import sys

# ── Windows asyncio event-loop fix (for Playwright / async libraries) ────────
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from dotenv import load_dotenv
load_dotenv()

import firebase_admin
from firebase_admin import credentials, firestore

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

# ── Firebase Admin initialisation ────────────────────────────────────────────
_BASE = os.path.dirname(__file__)
SERVICE_ACCOUNT_PATH = os.path.join(_BASE, "firebase", "serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

# Ensure Firestore client is ready
_db = firestore.client()
print("✓ Firebase Admin & Firestore initialised")

# ── Flask app ─────────────────────────────────────────────────────────────────
app = Flask(__name__)

# Configuration
app.config["SECRET_KEY"]          = os.getenv("SECRET_KEY", "skillbridge-secret-key")
app.config["JWT_SECRET_KEY"]      = os.getenv("JWT_SECRET_KEY", "skillbridge-jwt-secret")
app.config["JWT_ACCESS_TOKEN_EXPIRES"]  = timedelta(days=7)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

# ── Extensions ────────────────────────────────────────────────────────────────
jwt  = JWTManager(app)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5000",
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

# ── Error handlers ────────────────────────────────────────────────────────────
@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad request", "message": str(e)}), 400

@app.errorhandler(401)
def unauthorized(e):
    return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found", "message": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error", "message": str(e)}), 500

# ── Health check ──────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "SkillBridge API",
        "version": "2.0.0",
        "modules": ["auth", "profile", "dashboard", "assessment", "gap", "swot", "career", "roadmap"]
    }), 200

# ── Blueprints ────────────────────────────────────────────────────────────────
def _register(module_path, bp_name, url_prefix, label):
    try:
        import importlib
        mod = importlib.import_module(module_path)
        bp  = getattr(mod, bp_name)
        app.register_blueprint(bp, url_prefix=url_prefix)
        print(f"✓ {label} registered at {url_prefix}")
    except Exception as e:
        print(f"⚠  Could not register {label}: {e}")

_register("routes.auth_routes",       "auth_bp",       "/api/auth",        "Auth")
_register("routes.profile_routes",    "profile_bp",    "/api/profile",     "Profile")
_register("routes.dashboard_routes",  "dashboard_bp",  "/api/dashboard",   "Dashboard")
_register("routes.assessment_routes", "assessment_bp", "/api/assessment",  "Assessment")
_register("routes.gap_routes",        "gap_bp",        "/api/gap-analysis","Gap Analysis")
_register("routes.swot_routes",       "swot_bp",       "/api/swot",        "SWOT")
_register("routes.career_routes",     "career_bp",     "/api/career-match","Career Match")
_register("routes.roadmap_routes",    "roadmap_bp",    "/api/roadmap",     "Roadmap")

# ── Request logging ───────────────────────────────────────────────────────────
@app.before_request
def log_request():
    app.logger.info(f"{request.method} {request.path}")

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀  SkillBridge API Server v2.0")
    print("=" * 60)
    print(f"   Server        : http://localhost:5000")
    print(f"   Health check  : http://localhost:5000/api/health")
    print(f"   Modules       : Auth + Profile + Dashboard + Assessment")
    print(f"                   Gap + SWOT + Career + Roadmap")
    print("=" * 60 + "\n")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=os.getenv("FLASK_ENV") == "development",
        use_reloader=False,   # avoids double-init of firebase_admin
    )