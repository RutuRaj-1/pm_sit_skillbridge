import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/authApi';

const DEMAND_COLORS = {
    'Very High': '#A8E063',
    'High': '#fbbf24',
    'Explosive': '#f87171',
};

export default function CareerMatch() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedIdx, setExpandedIdx] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        api.get('/career-match')
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.error || 'Failed to load career matches'))
            .finally(() => setLoading(false));
    }, [isAuthenticated, navigate]);

    if (loading) return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sidebar />
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(35,114,39,0.2)', borderTopColor: '#237227', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ color: '#A8E063', fontWeight: 600 }}>Matching careers…</p>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
            <Sidebar />

            <div style={{ background: 'linear-gradient(135deg,rgba(35,114,39,0.12),rgba(168,224,99,0.04))', borderBottom: '1px solid rgba(35,114,39,0.15)', padding: '28px 32px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <span style={{ background: 'rgba(35,114,39,0.2)', border: '1px solid rgba(35,114,39,0.4)', borderRadius: 99, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#A8E063', display: 'inline-block', marginBottom: 10 }}>MODULE 6</span>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F0FFDF', marginBottom: 4 }}>💼 Career Matches</h1>
                    <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.9rem' }}>Your top career paths ranked by skill alignment</p>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
                {error && <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>⚠ {error}</div>}

                {data && (
                    <>
                        {(data.matches || []).map((career, idx) => {
                            const isTop = idx === 0;
                            const isExpanded = expandedIdx === idx;
                            return (
                                <div key={career.id || idx} style={{
                                    background: '#1F1F1F',
                                    border: `1px solid ${isTop ? 'rgba(168,224,99,0.5)' : 'rgba(35,114,39,0.2)'}`,
                                    borderRadius: 16, padding: 24, marginBottom: 16,
                                    position: 'relative', overflow: 'hidden',
                                }}>
                                    {isTop && (
                                        <div style={{
                                            position: 'absolute', top: 0, right: 0,
                                            background: 'linear-gradient(135deg,#237227,#A8E063)',
                                            padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700, color: '#1F1F1F',
                                            borderBottomLeftRadius: 10,
                                        }}>🏆 Best Match</div>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                <span style={{ fontSize: '1.5rem' }}>
                                                    {['🏆', '🥈', '🥉'][idx] || '💼'}
                                                </span>
                                                <h2 style={{ color: '#F0FFDF', fontWeight: 800, fontSize: '1.1rem' }}>{career.title}</h2>
                                            </div>
                                            <p style={{ color: 'rgba(240,255,223,0.55)', fontSize: '0.82rem', marginBottom: 12, lineHeight: 1.5 }}>
                                                {career.description}
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                                                <span style={{
                                                    background: 'rgba(35,114,39,0.15)', border: '1px solid rgba(35,114,39,0.3)',
                                                    borderRadius: 99, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#A8E063',
                                                }}>₹{career.avgSalaryLPA} LPA avg</span>
                                                <span style={{
                                                    background: 'rgba(168,224,99,0.08)', border: `1px solid ${DEMAND_COLORS[career.demandLevel] || '#A8E063'}30`,
                                                    borderRadius: 99, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
                                                    color: DEMAND_COLORS[career.demandLevel] || '#A8E063',
                                                }}>{career.demandLevel} Demand</span>
                                            </div>
                                        </div>

                                        {/* Match % ring */}
                                        <div style={{ textAlign: 'center', minWidth: 80 }}>
                                            <div style={{
                                                width: 72, height: 72, borderRadius: '50%',
                                                background: `conic-gradient(#237227 0deg, #A8E063 ${career.matchPct * 3.6}deg, rgba(35,114,39,0.1) ${career.matchPct * 3.6}deg)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                position: 'relative',
                                            }}>
                                                <div style={{
                                                    width: 54, height: 54, borderRadius: '50%',
                                                    background: '#1F1F1F', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexDirection: 'column',
                                                }}>
                                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: '#A8E063', lineHeight: 1 }}>{career.matchPct}%</span>
                                                </div>
                                            </div>
                                            <div style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.7rem', marginTop: 4 }}>match</div>
                                        </div>
                                    </div>

                                    {/* Guided expandable section */}
                                    <button
                                        onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                        style={{
                                            marginTop: 12, background: 'none', border: 'none',
                                            color: '#A8E063', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                                            display: 'flex', alignItems: 'center', gap: 4,
                                        }}
                                    >
                                        {isExpanded ? '▲ Hide details' : '▼ Why this career?'}
                                    </button>

                                    {isExpanded && (
                                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(35,114,39,0.15)' }}>
                                            {career.guidance && (
                                                <div style={{ background: 'rgba(35,114,39,0.08)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
                                                    <p style={{ color: 'rgba(240,255,223,0.75)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                                        🤖 {career.guidance}
                                                    </p>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                                {career.gaps?.length > 0 && (
                                                    <div>
                                                        <p style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Skills to Learn</p>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                            {career.gaps.map(g => (
                                                                <span key={g} style={{
                                                                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                                                    borderRadius: 99, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600, color: '#f87171',
                                                                }}>{g}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {career.growthPath && (
                                                    <div>
                                                        <p style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Growth Path</p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                                                            {career.growthPath.map((step, i) => (
                                                                <React.Fragment key={i}>
                                                                    <span style={{ color: '#A8E063', fontSize: '0.75rem', fontWeight: 600 }}>{step}</span>
                                                                    {i < career.growthPath.length - 1 && <span style={{ color: 'rgba(240,255,223,0.25)' }}>→</span>}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                            <button onClick={() => navigate('/roadmap')} style={{
                                padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
                                background: 'linear-gradient(135deg,#237227,#1a5a1a)', border: 'none', color: '#F0FFDF',
                                cursor: 'pointer', boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                            }}>
                                Generate Roadmap →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
