import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0d1a',
            color: '#e2e8f0',
            fontFamily: 'Inter, system-ui, sans-serif',
            gap: '24px',
            padding: '24px'
        }}>
            <div style={{
                background: 'rgba(18,18,36,0.85)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '20px',
                padding: '48px 60px',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                maxWidth: '480px',
                width: '100%'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
                <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #e2e8f0, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px'
                }}>
                    Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
                </h1>
                <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '0.95rem' }}>
                    You're signed in as <strong style={{ color: '#818cf8' }}>{user?.email}</strong>
                </p>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                        transition: 'opacity 0.2s'
                    }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
