import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/assessment', label: 'Assessment', icon: '📝' },
    { path: '/gap-analysis', label: 'Gap', icon: '📊' },
    { path: '/swot', label: 'SWOT', icon: '🔍' },
    { path: '/career', label: 'Career', icon: '💼' },
    { path: '/roadmap', label: 'Roadmap', icon: '🗺️' },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const initials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'rgba(31,31,31,0.93)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(35,114,39,0.2)',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
        }}>
            {/* Brand */}
            <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <span style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg,#A8E063,#237227)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                }}>SkillBridge</span>
            </NavLink>

            {/* Nav links — desktop */}
            <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                {NAV_LINKS.map(({ path, label, icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            background: isActive ? 'rgba(35,114,39,0.2)' : 'transparent',
                            color: isActive ? '#A8E063' : 'rgba(240,255,223,0.65)',
                            border: isActive ? '1px solid rgba(35,114,39,0.4)' : '1px solid transparent',
                        })}
                    >
                        <span>{icon}</span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </div>

            {/* User avatar + logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#237227,#A8E063)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#1F1F1F',
                    flexShrink: 0,
                }}>
                    {initials}
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(35,114,39,0.35)',
                        background: 'transparent',
                        color: 'rgba(240,255,223,0.65)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                        e.currentTarget.style.color = '#f87171';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(35,114,39,0.35)';
                        e.currentTarget.style.color = 'rgba(240,255,223,0.65)';
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
