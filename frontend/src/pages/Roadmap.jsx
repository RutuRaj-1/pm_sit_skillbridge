import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/authApi';

export default function Roadmap() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completedWeeks, setCompletedWeeks] = useState({});
    const [expandedWeek, setExpandedWeek] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        api.get('/roadmap')
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.error || 'Failed to load roadmap'))
            .finally(() => setLoading(false));
    }, [isAuthenticated, navigate]);

    const toggleWeek = (idx) => {
        setCompletedWeeks(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    if (loading) return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sidebar />
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(35,114,39,0.2)', borderTopColor: '#237227', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ color: '#A8E063', fontWeight: 600 }}>Generating your personalised roadmap…</p>
            </div>
        </div>
    );

    const completedCount = Object.values(completedWeeks).filter(Boolean).length;
    const totalWeeks = data?.weeks?.length || 0;
    const progressPct = totalWeeks ? Math.round((completedCount / totalWeeks) * 100) : 0;

    return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
            <Sidebar />

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,rgba(35,114,39,0.12),rgba(168,224,99,0.04))', borderBottom: '1px solid rgba(35,114,39,0.15)', padding: '28px 32px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <span style={{ background: 'rgba(35,114,39,0.2)', border: '1px solid rgba(35,114,39,0.4)', borderRadius: 99, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#A8E063', display: 'inline-block', marginBottom: 10 }}>MODULE 7</span>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F0FFDF', marginBottom: 4 }}>🗺️ Learning Roadmap</h1>
                    <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.9rem' }}>
                        12-week personalised plan to become a <strong style={{ color: '#A8E063' }}>{data?.career}</strong>
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
                {error && <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>⚠ {error}</div>}

                {data && (
                    <>
                        {/* Progress bar */}
                        <div style={{
                            background: '#1F1F1F', border: '1px solid rgba(35,114,39,0.2)',
                            borderRadius: 16, padding: 20, marginBottom: 28,
                            display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
                        }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ color: '#F0FFDF', fontWeight: 700, fontSize: '0.9rem' }}>Overall Progress</span>
                                    <span style={{ color: '#A8E063', fontWeight: 800 }}>{completedCount}/{totalWeeks} weeks</span>
                                </div>
                                <div style={{ height: 10, background: '#252525', borderRadius: 99 }}>
                                    <div style={{
                                        height: '100%', width: `${progressPct}%`,
                                        background: 'linear-gradient(90deg,#237227,#A8E063)',
                                        borderRadius: 99, transition: 'width 0.6s ease',
                                    }} />
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#A8E063' }}>{progressPct}%</div>
                                <div style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.72rem' }}>Complete</div>
                            </div>
                        </div>

                        {/* Week cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {(data.weeks || []).map((week, idx) => {
                                const isCompleted = completedWeeks[idx];
                                const isExpanded = expandedWeek === idx;
                                return (
                                    <div key={idx} style={{
                                        background: '#1F1F1F',
                                        border: `1px solid ${isCompleted ? 'rgba(168,224,99,0.4)' : 'rgba(35,114,39,0.2)'}`,
                                        borderRadius: 14,
                                        opacity: isCompleted ? 0.8 : 1,
                                        overflow: 'hidden',
                                        transition: 'all 0.2s',
                                    }}>
                                        {/* Week header */}
                                        <div
                                            onClick={() => setExpandedWeek(isExpanded ? null : idx)}
                                            style={{
                                                padding: '16px 20px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 14,
                                            }}
                                        >
                                            {/* Week number badge */}
                                            <div style={{
                                                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                                                background: isCompleted ? '#237227' : 'rgba(35,114,39,0.15)',
                                                border: `1px solid ${isCompleted ? '#237227' : 'rgba(35,114,39,0.3)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexDirection: 'column',
                                            }}>
                                                {isCompleted ? (
                                                    <span style={{ fontSize: '1.1rem' }}>✓</span>
                                                ) : (
                                                    <>
                                                        <span style={{ color: '#A8E063', fontSize: '0.65rem', fontWeight: 700, lineHeight: 1 }}>WK</span>
                                                        <span style={{ color: '#A8E063', fontSize: '0.9rem', fontWeight: 900, lineHeight: 1 }}>{week.week}</span>
                                                    </>
                                                )}
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                                    <h3 style={{
                                                        color: isCompleted ? 'rgba(240,255,223,0.5)' : '#F0FFDF',
                                                        fontWeight: 700, fontSize: '0.95rem',
                                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                                    }}>
                                                        {week.theme}
                                                    </h3>
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                                    {(week.skillsFocus || []).slice(0, 3).map(s => (
                                                        <span key={s} style={{
                                                            background: 'rgba(35,114,39,0.15)', border: '1px solid rgba(35,114,39,0.25)',
                                                            borderRadius: 99, padding: '1px 9px', fontSize: '0.7rem', fontWeight: 600, color: '#A8E063',
                                                        }}>{s}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {/* Complete toggle */}
                                                <button
                                                    onClick={e => { e.stopPropagation(); toggleWeek(idx); }}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700,
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                        background: isCompleted ? 'rgba(239,68,68,0.15)' : 'rgba(35,114,39,0.2)',
                                                        border: `1px solid ${isCompleted ? 'rgba(239,68,68,0.35)' : 'rgba(35,114,39,0.35)'}`,
                                                        color: isCompleted ? '#f87171' : '#A8E063',
                                                    }}
                                                >
                                                    {isCompleted ? 'Undo' : '✓ Done'}
                                                </button>
                                                <span style={{ color: 'rgba(240,255,223,0.35)', fontSize: '0.8rem' }}>
                                                    {isExpanded ? '▲' : '▼'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Expanded detail */}
                                        {isExpanded && (
                                            <div style={{
                                                borderTop: '1px solid rgba(35,114,39,0.12)',
                                                padding: '16px 20px 20px',
                                                display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16,
                                            }}>
                                                {/* Tasks */}
                                                <div>
                                                    <p style={{ color: '#A8E063', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                                                        📋 Tasks
                                                    </p>
                                                    {(week.tasks || []).map((task, i) => (
                                                        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                                                            <span style={{ color: '#237227', flexShrink: 0 }}>▸</span>
                                                            <span style={{ color: 'rgba(240,255,223,0.7)', fontSize: '0.82rem', lineHeight: 1.4 }}>{task}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Resources */}
                                                <div>
                                                    <p style={{ color: '#A8E063', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                                                        📚 Resources
                                                    </p>
                                                    {(week.resources || []).map((r, i) => (
                                                        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                                                            <span style={{ color: '#237227', flexShrink: 0 }}>▸</span>
                                                            <span style={{ color: 'rgba(240,255,223,0.7)', fontSize: '0.82rem' }}>{r}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Milestone */}
                                                {week.milestone && (
                                                    <div style={{
                                                        background: 'rgba(35,114,39,0.1)', border: '1px solid rgba(35,114,39,0.2)',
                                                        borderRadius: 10, padding: 12,
                                                    }}>
                                                        <p style={{ color: '#A8E063', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                                            🏁 Milestone
                                                        </p>
                                                        <p style={{ color: 'rgba(240,255,223,0.75)', fontSize: '0.82rem', lineHeight: 1.4 }}>{week.milestone}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Final CTA */}
                        <div style={{
                            marginTop: 32, background: 'linear-gradient(135deg,rgba(35,114,39,0.15),rgba(168,224,99,0.08))',
                            border: '1px solid rgba(35,114,39,0.35)', borderRadius: 16, padding: 28, textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎓</div>
                            <h3 style={{ color: '#F0FFDF', fontWeight: 800, fontSize: '1.1rem', marginBottom: 6 }}>You're on the right path!</h3>
                            <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.875rem', marginBottom: 16 }}>
                                Complete all 12 weeks to achieve your career goal. Check off weeks as you progress.
                            </p>
                            <button onClick={() => navigate('/dashboard')} style={{
                                padding: '11px 24px', borderRadius: 10, fontWeight: 700,
                                fontSize: '0.875rem', cursor: 'pointer',
                                background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                                border: 'none', color: '#F0FFDF',
                                boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                            }}>
                                Back to Dashboard
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
