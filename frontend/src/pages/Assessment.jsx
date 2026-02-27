import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Proctoring from '../components/Proctoring';
import MonacoEditor from '../components/MonacoEditor';
import api from '../api/authApi';

const SKILLS = [
    'Python', 'JavaScript', 'Java', 'React', 'Node.js',
    'SQL', 'DSA', 'Machine Learning', 'System Design', 'C++',
];
const TIMER_MINUTES = 30;

export default function Assessment() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [phase, setPhase] = useState('select'); // select | loading | active | result
    const [selectedSkill, setSelectedSkill] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Assessment state
    const [assessmentId, setAssessmentId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [codeAnswers, setCodeAnswers] = useState({});
    const [activeQ, setActiveQ] = useState(0);

    // Timer
    const [timeLeft, setTimeLeft] = useState(TIMER_MINUTES * 60);
    const timerRef = useRef(null);

    // Proctoring
    const [terminated, setTerminated] = useState(false);

    // Results
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    // Countdown timer
    useEffect(() => {
        if (phase !== 'active') return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const startAssessment = async () => {
        if (!selectedSkill) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/assessment/generate', { skill: selectedSkill });
            setAssessmentId(res.data.assessmentId);
            setQuestions(res.data.questions);
            setTimeLeft(TIMER_MINUTES * 60);
            setPhase('active');
        } catch (e) {
            setError(e.response?.data?.error || 'Failed to generate assessment');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (isTerminated = false) => {
        if (submitting) return;
        clearInterval(timerRef.current);
        setSubmitting(true);
        setPhase('loading');
        try {
            const allAnswers = { ...answers };
            // Merge code answers
            Object.entries(codeAnswers).forEach(([id, code]) => {
                allAnswers[id] = code;
            });
            const res = await api.post('/assessment/submit', {
                assessmentId,
                answers: allAnswers,
                terminated: isTerminated,
            });
            setResult(res.data);
            setPhase('result');
        } catch (e) {
            setError(e.response?.data?.error || 'Submit failed');
            setPhase('active');
        } finally {
            setSubmitting(false);
        }
    };

    const handleTerminate = () => {
        setTerminated(true);
        handleSubmit(true);
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const mcqs = questions.filter(q => q.type === 'mcq');
    const codeQs = questions.filter(q => q.type === 'code');
    const currentQ = questions[activeQ];
    const timerUrgent = timeLeft <= 300;

    const cardStyle = {
        background: '#1F1F1F',
        border: '1px solid rgba(35,114,39,0.2)',
        borderRadius: 16,
        padding: 24,
    };

    // ── Phase: Skill Select ──────────────────────────────────────────────────
    if (phase === 'select') {
        return (
            <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
                <Sidebar />
                <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(35,114,39,0.15)', border: '1px solid rgba(35,114,39,0.35)',
                            borderRadius: 99, padding: '4px 14px', marginBottom: 14,
                        }}>
                            <span style={{ color: '#A8E063', fontWeight: 700, fontSize: '0.75rem' }}>MODULE 3</span>
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F0FFDF', marginBottom: 8 }}>
                            📝 Skill Assessment
                        </h1>
                        <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.9rem' }}>
                            Select the skill you want to be assessed on. You'll get 5 MCQs + 2 coding questions in 30 minutes.
                        </p>
                    </div>

                    <div style={cardStyle}>
                        <p style={{
                            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.06em', color: 'rgba(240,255,223,0.45)', marginBottom: 16,
                        }}>Choose a skill</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {SKILLS.map(s => (
                                <button key={s} onClick={() => setSelectedSkill(s)} style={{
                                    padding: '9px 18px', borderRadius: 10, fontWeight: 600,
                                    fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.18s',
                                    background: selectedSkill === s ? 'rgba(35,114,39,0.25)' : '#2B2A2A',
                                    border: selectedSkill === s ? '1px solid #237227' : '1px solid rgba(35,114,39,0.2)',
                                    color: selectedSkill === s ? '#A8E063' : 'rgba(240,255,223,0.6)',
                                }}>
                                    {selectedSkill === s ? '✓ ' : ''}{s}
                                </button>
                            ))}
                        </div>

                        {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: 12 }}>⚠ {error}</p>}

                        {/* Rules */}
                        <div style={{
                            background: '#252525', border: '1px solid rgba(35,114,39,0.15)',
                            borderRadius: 10, padding: 16, marginBottom: 20,
                        }}>
                            <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.78rem', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Rules
                            </p>
                            {['⏱ 30 minute time limit', '5 MCQ auto-graded questions', '2 coding questions',
                                '3 tab-switch violations = auto-termination', 'No right-click or copy allowed'].map(r => (
                                    <div key={r} style={{ color: 'rgba(240,255,223,0.6)', fontSize: '0.82rem', marginBottom: 5, display: 'flex', gap: 8 }}>
                                        <span style={{ color: '#237227' }}>▸</span> {r}
                                    </div>
                                ))}
                        </div>

                        <button
                            onClick={startAssessment}
                            disabled={loading || !selectedSkill}
                            style={{
                                width: '100%', padding: '13px', borderRadius: 11, fontWeight: 700,
                                fontSize: '0.95rem', cursor: 'pointer', border: 'none',
                                background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                                color: '#F0FFDF', opacity: (!selectedSkill || loading) ? 0.5 : 1,
                                boxShadow: '0 4px 20px rgba(35,114,39,0.35)',
                            }}
                        >
                            {loading ? '⏳ Generating questions…' : '🚀 Start Assessment'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Phase: Loading ───────────────────────────────────────────────────────
    if (phase === 'loading') {
        return (
            <div style={{ background: '#2B2A2A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 56, height: 56, border: '3px solid rgba(35,114,39,0.2)',
                        borderTopColor: '#237227', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                    }} />
                    <p style={{ color: '#F0FFDF', fontWeight: 600 }}>Processing…</p>
                </div>
            </div>
        );
    }

    // ── Phase: Result ────────────────────────────────────────────────────────
    if (phase === 'result' && result) {
        return (
            <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
                <Sidebar />
                <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 24px' }}>
                    <div style={{ ...cardStyle, textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 12 }}>
                            {terminated ? '🚫' : result.mcqPercentage >= 60 ? '🏆' : '📊'}
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F0FFDF', marginBottom: 6 }}>
                            {terminated ? 'Assessment Terminated' : 'Assessment Complete!'}
                        </h1>
                        <p style={{ color: 'rgba(240,255,223,0.5)', marginBottom: 28 }}>
                            {terminated ? 'Too many violations were detected.' : `You scored ${result.score}/${result.totalMcq} on MCQs`}
                        </p>

                        {!terminated && (
                            <div style={{
                                background: '#252525', borderRadius: 14, padding: 24, marginBottom: 24,
                            }}>
                                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#A8E063', marginBottom: 4 }}>
                                    {result.mcqPercentage}%
                                </div>
                                <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.85rem' }}>MCQ Score</p>
                                <div style={{ height: 8, background: '#1F1F1F', borderRadius: 99, marginTop: 14 }}>
                                    <div style={{
                                        height: '100%', width: `${result.mcqPercentage}%`,
                                        background: result.mcqPercentage >= 60
                                            ? 'linear-gradient(90deg,#237227,#A8E063)'
                                            : 'linear-gradient(90deg,#ef4444,#f87171)',
                                        borderRadius: 99, transition: 'width 1s ease',
                                    }} />
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                onClick={() => navigate('/gap-analysis')}
                                style={{
                                    padding: '11px 24px', borderRadius: 10, fontWeight: 700,
                                    fontSize: '0.875rem', cursor: 'pointer',
                                    background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                                    border: 'none', color: '#F0FFDF',
                                    boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                                }}
                            >
                                View Gap Analysis →
                            </button>
                            <button
                                onClick={() => { setPhase('select'); setAnswers({}); setCodeAnswers({}); setTerminated(false); }}
                                style={{
                                    padding: '11px 24px', borderRadius: 10, fontWeight: 700,
                                    fontSize: '0.875rem', cursor: 'pointer',
                                    background: 'transparent',
                                    border: '1px solid rgba(35,114,39,0.35)',
                                    color: 'rgba(240,255,223,0.6)',
                                }}
                            >
                                Retake
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Phase: Active Assessment ─────────────────────────────────────────────
    return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
            <Sidebar />

            {/* Top bar */}
            <div style={{
                background: '#1F1F1F', borderBottom: '1px solid rgba(35,114,39,0.15)',
                padding: '12px 24px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                        background: 'rgba(35,114,39,0.2)', border: '1px solid rgba(35,114,39,0.4)',
                        borderRadius: 8, padding: '4px 12px', fontSize: '0.8rem',
                        fontWeight: 700, color: '#A8E063',
                    }}>{selectedSkill}</span>
                    <span style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.8rem' }}>
                        Q {activeQ + 1} of {questions.length}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Timer */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: timerUrgent ? 'rgba(239,68,68,0.15)' : 'rgba(35,114,39,0.15)',
                        border: `1px solid ${timerUrgent ? 'rgba(239,68,68,0.4)' : 'rgba(35,114,39,0.35)'}`,
                        borderRadius: 99, padding: '5px 14px',
                    }}>
                        <span style={{ fontSize: '0.8rem' }}>⏱</span>
                        <span style={{
                            fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800,
                            color: timerUrgent ? '#f87171' : '#A8E063',
                        }}>{formatTime(timeLeft)}</span>
                    </div>

                    {/* Proctoring widget */}
                    <Proctoring onTerminate={handleTerminate} onViolation={() => { }} />
                </div>
            </div>

            <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>
                {/* Question nav pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                    {questions.map((q, i) => (
                        <button key={i} onClick={() => setActiveQ(i)} style={{
                            width: 38, height: 38, borderRadius: 8, fontWeight: 700,
                            fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                            background: i === activeQ
                                ? '#237227'
                                : (answers[String(q.id)] !== undefined || codeAnswers[String(q.id)])
                                    ? 'rgba(35,114,39,0.2)'
                                    : '#1F1F1F',
                            border: i === activeQ
                                ? '1px solid #237227'
                                : '1px solid rgba(35,114,39,0.2)',
                            color: i === activeQ ? '#F0FFDF' : '#A8E063',
                        }}>
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* Current question card */}
                {currentQ && (
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{
                                background: currentQ.type === 'code' ? 'rgba(168,224,99,0.15)' : 'rgba(35,114,39,0.15)',
                                border: '1px solid rgba(35,114,39,0.35)',
                                borderRadius: 6, padding: '2px 10px', fontSize: '0.7rem',
                                fontWeight: 700, color: '#A8E063', textTransform: 'uppercase',
                            }}>
                                {currentQ.type === 'code' ? '💻 Code' : '🔘 MCQ'}
                            </span>
                            <span style={{ color: 'rgba(240,255,223,0.35)', fontSize: '0.75rem' }}>
                                Question {activeQ + 1}
                            </span>
                        </div>

                        <h2 style={{ color: '#F0FFDF', fontSize: '1rem', fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                            {currentQ.question}
                        </h2>

                        {/* MCQ options */}
                        {currentQ.type === 'mcq' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {currentQ.options.map((opt, idx) => {
                                    const selected = answers[String(currentQ.id)] === idx;
                                    return (
                                        <button key={idx} onClick={() => setAnswers(a => ({ ...a, [String(currentQ.id)]: idx }))} style={{
                                            width: '100%', padding: '12px 16px', borderRadius: 10,
                                            textAlign: 'left', cursor: 'pointer', transition: 'all 0.18s',
                                            background: selected ? 'rgba(35,114,39,0.25)' : '#252525',
                                            border: selected ? '1px solid #237227' : '1px solid rgba(35,114,39,0.15)',
                                            color: selected ? '#A8E063' : 'rgba(240,255,223,0.75)',
                                            fontSize: '0.875rem', fontWeight: 500,
                                            display: 'flex', alignItems: 'center', gap: 10,
                                        }}>
                                            <span style={{
                                                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                                background: selected ? '#237227' : 'rgba(35,114,39,0.1)',
                                                border: `1px solid ${selected ? '#237227' : 'rgba(35,114,39,0.3)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.7rem', fontWeight: 700, color: selected ? '#F0FFDF' : '#A8E063',
                                            }}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Code question */}
                        {currentQ.type === 'code' && (
                            <MonacoEditor
                                language={currentQ.language || 'python'}
                                value={codeAnswers[String(currentQ.id)] || currentQ.starterCode || ''}
                                onChange={(val) => setCodeAnswers(prev => ({ ...prev, [String(currentQ.id)]: val }))}
                                height="260px"
                            />
                        )}

                        {/* Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 10 }}>
                            <button
                                onClick={() => setActiveQ(i => Math.max(0, i - 1))}
                                disabled={activeQ === 0}
                                style={{
                                    padding: '10px 20px', borderRadius: 9, fontWeight: 700, fontSize: '0.85rem',
                                    background: 'transparent', border: '1px solid rgba(35,114,39,0.3)',
                                    color: 'rgba(240,255,223,0.55)', cursor: 'pointer',
                                    opacity: activeQ === 0 ? 0.4 : 1,
                                }}
                            >← Previous</button>

                            {activeQ < questions.length - 1 ? (
                                <button
                                    onClick={() => setActiveQ(i => Math.min(questions.length - 1, i + 1))}
                                    style={{
                                        padding: '10px 20px', borderRadius: 9, fontWeight: 700, fontSize: '0.85rem',
                                        background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                                        border: 'none', color: '#F0FFDF', cursor: 'pointer',
                                    }}
                                >Next →</button>
                            ) : (
                                <button
                                    onClick={() => handleSubmit(false)}
                                    disabled={submitting}
                                    style={{
                                        padding: '10px 24px', borderRadius: 9, fontWeight: 700, fontSize: '0.85rem',
                                        background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                                        border: 'none', color: '#F0FFDF', cursor: 'pointer',
                                        boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                                    }}
                                >
                                    {submitting ? '⏳ Submitting…' : '✅ Submit Assessment'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
