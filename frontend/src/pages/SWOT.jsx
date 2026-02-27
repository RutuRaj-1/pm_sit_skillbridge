import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/authApi';

const QUADRANT_CONFIG = {
    strengths: { label: 'Strengths', emoji: '💪', bg: 'rgba(35,114,39,0.12)', border: 'rgba(35,114,39,0.35)', accent: '#A8E063' },
    weaknesses: { label: 'Weaknesses', emoji: '⚠️', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.35)', accent: '#f87171' },
    opportunities: { label: 'Opportunities', emoji: '🚀', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.35)', accent: '#93c5fd' },
    threats: { label: 'Threats', emoji: '🛡️', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.35)', accent: '#fbbf24' },
};

export default function SWOT() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedText, setExpandedText] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        api.get('/swot')
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.error || 'Failed to load SWOT'))
            .finally(() => setLoading(false));
    }, [isAuthenticated, navigate]);

    if (loading) return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sidebar />
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(35,114,39,0.2)', borderTopColor: '#237227', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ color: '#A8E063', fontWeight: 600 }}>Generating SWOT analysis…</p>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
            <Sidebar />

            <div style={{ background: 'linear-gradient(135deg,rgba(35,114,39,0.12),rgba(168,224,99,0.04))', borderBottom: '1px solid rgba(35,114,39,0.15)', padding: '28px 32px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ background: 'rgba(35,114,39,0.2)', border: '1px solid rgba(35,114,39,0.4)', borderRadius: 99, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#A8E063' }}>MODULE 5</span>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F0FFDF', marginBottom: 4 }}>🔍 SWOT Analysis</h1>
                    <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.9rem' }}>Your personalised Strengths, Weaknesses, Opportunities & Threats</p>
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                {error && <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>⚠ {error}</div>}

                {data && (
                    <>
                        {/* 2x2 SWOT Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                            {Object.entries(QUADRANT_CONFIG).map(([key, cfg]) => (
                                <div key={key} style={{
                                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                                    borderRadius: 16, padding: 24,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                        <span style={{ fontSize: '1.4rem' }}>{cfg.emoji}</span>
                                        <h3 style={{ color: cfg.accent, fontWeight: 800, fontSize: '1rem' }}>{cfg.label}</h3>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {(data[key] || []).map((item, i) => (
                                            <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                                <span style={{ color: cfg.accent, flexShrink: 0, marginTop: 2 }}>▸</span>
                                                <span style={{ color: 'rgba(240,255,223,0.75)', fontSize: '0.85rem', lineHeight: 1.5 }}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* AI Analysis */}
                        {data.llmAnalysis && (
                            <div style={{
                                background: '#1F1F1F', border: '1px solid rgba(35,114,39,0.35)',
                                borderRadius: 16, padding: 24, marginBottom: 24,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <span style={{ fontSize: '1.2rem' }}>🤖</span>
                                    <h3 style={{ color: '#A8E063', fontWeight: 700 }}>AI Assessment</h3>
                                </div>
                                <p style={{ color: 'rgba(240,255,223,0.75)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                                    {expandedText ? data.llmAnalysis : data.llmAnalysis.slice(0, 300) + (data.llmAnalysis.length > 300 ? '…' : '')}
                                </p>
                                {data.llmAnalysis.length > 300 && (
                                    <button onClick={() => setExpandedText(!expandedText)} style={{
                                        marginTop: 8, background: 'none', border: 'none', color: '#A8E063',
                                        cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                                    }}>
                                        {expandedText ? '↑ Show less' : '↓ Read more'}
                                    </button>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => navigate('/career')} style={{
                                padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
                                background: 'linear-gradient(135deg,#237227,#1a5a1a)', border: 'none', color: '#F0FFDF',
                                cursor: 'pointer', boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                            }}>
                                View Career Matches →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
