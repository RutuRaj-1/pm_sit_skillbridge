import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/authApi';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';

export default function GapAnalysis() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        api.get('/gap-analysis')
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.error || 'Failed to load gap analysis'))
            .finally(() => setLoading(false));
    }, [isAuthenticated, navigate]);

    const cardStyle = {
        background: '#1F1F1F', border: '1px solid rgba(35,114,39,0.2)',
        borderRadius: 16, padding: 24,
    };

    if (loading) return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sidebar />
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(35,114,39,0.2)', borderTopColor: '#237227', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ color: '#A8E063', fontWeight: 600 }}>Analysing your gaps…</p>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
            <Sidebar />

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,rgba(35,114,39,0.12),rgba(168,224,99,0.04))', borderBottom: '1px solid rgba(35,114,39,0.15)', padding: '28px 32px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ background: 'rgba(35,114,39,0.2)', border: '1px solid rgba(35,114,39,0.4)', borderRadius: 99, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#A8E063' }}>MODULE 4</span>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F0FFDF', marginBottom: 4 }}>📊 Skill Gap Analysis</h1>
                    <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.9rem' }}>
                        Your skills vs industry benchmark for <strong style={{ color: '#A8E063' }}>{data?.careerInterest}</strong>
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                {error && <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>⚠ {error}</div>}

                {data && (
                    <>
                        {/* Overall match badge */}
                        <div style={{ ...cardStyle, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'center', minWidth: 100 }}>
                                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: data.overallMatch >= 60 ? '#A8E063' : '#f59e0b' }}>
                                    {data.overallMatch}%
                                </div>
                                <div style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.78rem', fontWeight: 600 }}>Overall Match</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ height: 10, background: '#252525', borderRadius: 99, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${data.overallMatch}%`, background: 'linear-gradient(90deg,#237227,#A8E063)', borderRadius: 99, transition: 'width 1s ease' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                                    <span style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.75rem' }}>0%</span>
                                    <span style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.75rem' }}>100%</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A8E063' }}>{data.strengths?.length || 0}</div>
                                    <div style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.72rem' }}>Strengths</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>{data.gaps?.length || 0}</div>
                                    <div style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.72rem' }}>Gaps</div>
                                </div>
                            </div>
                        </div>

                        {/* Charts row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))', gap: 20, marginBottom: 24 }}>
                            {/* Radar */}
                            <div style={cardStyle}>
                                <h3 style={{ color: '#F0FFDF', fontWeight: 700, marginBottom: 16 }}>Skill Radar</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <RadarChart data={data.radarData}>
                                        <PolarGrid stroke="rgba(35,114,39,0.2)" />
                                        <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(240,255,223,0.55)', fontSize: 11 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Industry" dataKey="industry" stroke="#A8E063" fill="#A8E063" fillOpacity={0.1} />
                                        <Radar name="You" dataKey="user" stroke="#237227" fill="#237227" fillOpacity={0.4} />
                                        <Legend wrapperStyle={{ color: 'rgba(240,255,223,0.6)', fontSize: '0.8rem' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bar chart */}
                            <div style={cardStyle}>
                                <h3 style={{ color: '#F0FFDF', fontWeight: 700, marginBottom: 16 }}>Skill Comparison</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={data.radarData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                        <CartesianGrid horizontal={false} stroke="rgba(35,114,39,0.1)" />
                                        <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgba(240,255,223,0.4)', fontSize: 10 }} />
                                        <YAxis type="category" dataKey="skill" tick={{ fill: 'rgba(240,255,223,0.6)', fontSize: 10 }} width={90} />
                                        <Tooltip
                                            contentStyle={{ background: '#1F1F1F', border: '1px solid rgba(35,114,39,0.3)', borderRadius: 8 }}
                                            labelStyle={{ color: '#F0FFDF' }}
                                        />
                                        <Bar dataKey="user" name="You" fill="#237227" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="industry" name="Industry" fill="rgba(168,224,99,0.3)" radius={[0, 4, 4, 0]} />
                                        <Legend wrapperStyle={{ color: 'rgba(240,255,223,0.6)', fontSize: '0.8rem' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Gap cards */}
                        {data.gaps?.length > 0 && (
                            <div style={{ ...cardStyle, marginBottom: 24 }}>
                                <h3 style={{ color: '#F0FFDF', fontWeight: 700, marginBottom: 16 }}>🚨 Skills to Bridge</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                    {data.gaps.map(gap => (
                                        <div key={gap.skill} style={{
                                            background: gap.severity === 'critical' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                            border: `1px solid ${gap.severity === 'critical' ? 'rgba(239,68,68,0.35)' : 'rgba(245,158,11,0.35)'}`,
                                            borderRadius: 10, padding: '10px 16px', minWidth: 160,
                                        }}>
                                            <div style={{ fontWeight: 700, color: '#F0FFDF', marginBottom: 4 }}>{gap.skill}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                                <span style={{ color: 'rgba(240,255,223,0.5)' }}>You: {gap.user}%</span>
                                                <span style={{ color: 'rgba(240,255,223,0.5)' }}>Need: {gap.industry}%</span>
                                            </div>
                                            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${gap.user}%`, background: gap.severity === 'critical' ? '#ef4444' : '#f59e0b', borderRadius: 99 }} />
                                            </div>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: gap.severity === 'critical' ? '#f87171' : '#fbbf24', textTransform: 'uppercase', marginTop: 4, display: 'block' }}>
                                                {gap.severity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* LLM explanation */}
                        {data.llmExplanation && (
                            <div style={{ ...cardStyle, marginBottom: 24, borderColor: 'rgba(35,114,39,0.35)' }}>
                                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                    <span style={{ fontSize: '1.2rem' }}>🤖</span>
                                    <h3 style={{ color: '#A8E063', fontWeight: 700 }}>AI Analysis</h3>
                                </div>
                                <p style={{ color: 'rgba(240,255,223,0.75)', lineHeight: 1.7, fontSize: '0.9rem' }}>{data.llmExplanation}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => navigate('/swot')} style={{
                                padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
                                background: 'linear-gradient(135deg,#237227,#1a5a1a)', border: 'none', color: '#F0FFDF',
                                cursor: 'pointer', boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                            }}>
                                View SWOT Analysis →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
