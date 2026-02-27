import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import GapAnalysis from './pages/GapAnalysis';
import SWOT from './pages/SWOT';
import CareerMatch from './pages/CareerMatch';
import Roadmap from './pages/Roadmap';

/* ── Route Guards ──────────────────────────────────────────────────────────── */

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <LoadingFull />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <LoadingFull />;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function LoadingFull() {
    return (
        <div style={{
            minHeight: '100vh', background: '#2B2A2A',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
            <div style={{
                width: 46, height: 46,
                border: '3px solid rgba(35,114,39,0.2)',
                borderTopColor: '#237227',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.9rem' }}>Loading SkillBridge…</p>
        </div>
    );
}

/* ── Routes ────────────────────────────────────────────────────────────────── */

function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Semi-private: accessible after login */}
            <Route path="/profile-setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />

            {/* Protected — core modules */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
            <Route path="/gap-analysis" element={<PrivateRoute><GapAnalysis /></PrivateRoute>} />
            <Route path="/swot" element={<PrivateRoute><SWOT /></PrivateRoute>} />
            <Route path="/career" element={<PrivateRoute><CareerMatch /></PrivateRoute>} />
            <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
