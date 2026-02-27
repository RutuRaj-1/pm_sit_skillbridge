import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/assessment', label: 'Assessment', icon: '📝' },
    { path: '/gap-analysis', label: 'Gap Analysis', icon: '📊' },
    { path: '/swot', label: 'SWOT', icon: '🔍' },
    { path: '/career', label: 'Career Match', icon: '💼' },
    { path: '/roadmap', label: 'Roadmap', icon: '🗺️' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fullName = user?.full_name || 'User';
    const initials = fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <aside style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '260px',
            background: '#1F1F1F',
            borderRight: '1px solid rgba(35,114,39,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
        }}>
            {/* Brand Logo */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(35,114,39,0.1)' }}>
                <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden' }}>
                        <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg,#A8E063,#237227)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                    }}>SkillBridge</span>
                </NavLink>
            </div>

            {/* Nav Links */}
            <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                <p style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 8 }}>Modules</p>
                {NAV_LINKS.map(({ path, label, icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            borderRadius: 12,
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            background: isActive ? 'linear-gradient(90deg, rgba(35,114,39,0.2) 0%, transparent 100%)' : 'transparent',
                            color: isActive ? '#A8E063' : 'rgba(240,255,223,0.65)',
                            borderLeft: isActive ? '3px solid #A8E063' : '3px solid transparent',
                        })}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </div>

            {/* User Profile Footer */}
            <div style={{ padding: '20px', borderTop: '1px solid rgba(35,114,39,0.1)', background: 'rgba(25,25,25,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#237227,#A8E063)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800, color: '#1F1F1F',
                    }}>
                        {initials}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ color: '#F0FFDF', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {fullName}
                        </p>
                        <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.75rem' }}>Student</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', padding: '10px', borderRadius: 10,
                        border: '1px solid rgba(239,68,68,0.2)',
                        background: 'rgba(239,68,68,0.05)',
                        color: '#f87171', fontSize: '0.85rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.05)';
                    }}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
