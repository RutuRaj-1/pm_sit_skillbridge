import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../api/authApi';

const SKILL_OPTIONS = [
    'Python', 'JavaScript', 'Java', 'C++', 'C', 'TypeScript',
    'React', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'DSA', 'System Design', 'Machine Learning', 'Deep Learning',
    'Docker', 'Kubernetes', 'AWS', 'Git', 'Linux',
    'HTML/CSS', 'REST APIs', 'GraphQL', 'Microservices',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const TAB_ICONS = ['🎯', '🐙', '📄'];
const TAB_LABELS = ['Skills', 'GitHub Repos', 'Resume'];

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);

    // Skills state
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillLevels, setSkillLevels] = useState({});
    const [savingSkills, setSavingSkills] = useState(false);
    const [skillsSaved, setSkillsSaved] = useState(false);

    // Repo state
    const [repoUrl, setRepoUrl] = useState('');
    const [repos, setRepos] = useState([]);
    const [scrapingRepo, setScrapingRepo] = useState(false);
    const [repoError, setRepoError] = useState('');

    // Resume state
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumeResult, setResumeResult] = useState(null);
    const [resumeError, setResumeError] = useState('');
    const fileInputRef = useRef();

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    /* ── Skills ── */
    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const setLevel = (skill, level) => setSkillLevels(prev => ({ ...prev, [skill]: level }));

    const saveSkills = async () => {
        if (selectedSkills.length === 0) return;
        setSavingSkills(true);
        try {
            const skills = selectedSkills.map(s => ({
                name: s,
                level: skillLevels[s] || 'Beginner',
                category: 'technical',
            }));
            await api.post('/dashboard/skills', { skills });
            setSkillsSaved(true);
            setTimeout(() => setSkillsSaved(false), 2500);
        } catch (e) {
            console.error(e);
        } finally {
            setSavingSkills(false);
        }
    };

    /* ── Repo ── */
    const scrapeRepo = async () => {
        if (!repoUrl.trim()) return;
        setScrapingRepo(true);
        setRepoError('');
        try {
            const res = await api.post('/dashboard/repo', { url: repoUrl.trim() });
            setRepos(prev => [res.data.repo, ...prev]);
            setRepoUrl('');
        } catch (e) {
            setRepoError(e.response?.data?.error || 'Failed to scrape repo.');
        } finally {
            setScrapingRepo(false);
        }
    };

    /* ── Resume ── */
    const handleResumeUpload = async () => {
        if (!resumeFile) return;
        setUploading(true);
        setResumeError('');
        const formData = new FormData();
        formData.append('resume', resumeFile);
        try {
            const res = await api.post('/dashboard/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResumeResult(res.data.parsed);
        } catch (e) {
            setResumeError(e.response?.data?.error || 'Failed to parse resume.');
        } finally {
            setUploading(false);
        }
    };

    const cardStyle = {
        background: '#1F1F1F',
        border: '1px solid rgba(35,114,39,0.2)',
        borderRadius: 16,
        padding: 24,
    };

    return (
        <div style={{ background: '#2B2A2A', minHeight: '100vh', paddingLeft: 260 }}>
            <Sidebar />

            {/* Hero bar */}
            <div style={{
                background: 'linear-gradient(135deg,rgba(35,114,39,0.15),rgba(168,224,99,0.05))',
                borderBottom: '1px solid rgba(35,114,39,0.15)',
                padding: '28px 32px',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <span style={{
                            background: 'rgba(35,114,39,0.2)', border: '1px solid rgba(35,114,39,0.4)',
                            borderRadius: 99, padding: '3px 12px', fontSize: '0.75rem',
                            fontWeight: 700, color: '#A8E063',
                        }}>MODULE 2</span>
                        <span style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.75rem' }}>Data Ingestion</span>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F0FFDF', marginBottom: 4 }}>
                        Your Dashboard
                    </h1>
                    <p style={{ color: 'rgba(240,255,223,0.55)', fontSize: '0.9rem' }}>
                        Tell us your skills, repos, and upload your resume — we'll do the rest.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                    {TAB_LABELS.map((label, i) => (
                        <button key={i} onClick={() => setActiveTab(i)} style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: '10px 20px', borderRadius: 12,
                            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: activeTab === i ? 'rgba(35,114,39,0.25)' : 'rgba(31,31,31,0.8)',
                            border: activeTab === i ? '1px solid rgba(35,114,39,0.5)' : '1px solid rgba(35,114,39,0.15)',
                            color: activeTab === i ? '#A8E063' : 'rgba(240,255,223,0.55)',
                        }}>
                            <span>{TAB_ICONS[i]}</span>
                            <span>{label}</span>
                            {i === 0 && selectedSkills.length > 0 && (
                                <span style={{
                                    background: '#237227', color: '#F0FFDF', fontSize: '0.7rem',
                                    fontWeight: 700, borderRadius: 99, padding: '1px 7px',
                                }}>{selectedSkills.length}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ─── TAB 0: Skills ─── */}
                {activeTab === 0 && (
                    <div style={cardStyle}>
                        <h2 style={{ color: '#F0FFDF', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>
                            Select Your Skills
                        </h2>
                        <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.85rem', marginBottom: 20 }}>
                            Pick all technologies you know — we'll assess your level.
                        </p>

                        {/* Skill chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {SKILL_OPTIONS.map(skill => (
                                <button key={skill} onClick={() => toggleSkill(skill)} style={{
                                    padding: '7px 14px', borderRadius: 99,
                                    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 0.18s',
                                    background: selectedSkills.includes(skill) ? 'rgba(35,114,39,0.25)' : 'rgba(43,42,42,0.8)',
                                    border: selectedSkills.includes(skill) ? '1px solid #237227' : '1px solid rgba(240,255,223,0.1)',
                                    color: selectedSkills.includes(skill) ? '#A8E063' : 'rgba(240,255,223,0.6)',
                                }}>
                                    {selectedSkills.includes(skill) ? '✓ ' : ''}{skill}
                                </button>
                            ))}
                        </div>

                        {/* Level pickers for selected skills */}
                        {selectedSkills.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.78rem', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Set proficiency level
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {selectedSkills.map(skill => (
                                        <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                            <span style={{ color: '#F0FFDF', fontWeight: 600, fontSize: '0.85rem', minWidth: 130 }}>{skill}</span>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {LEVELS.map(lvl => (
                                                    <button key={lvl} onClick={() => setLevel(skill, lvl)} style={{
                                                        padding: '4px 12px', borderRadius: 8, fontSize: '0.75rem',
                                                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                                        background: (skillLevels[skill] || 'Beginner') === lvl ? '#237227' : 'transparent',
                                                        border: (skillLevels[skill] || 'Beginner') === lvl ? '1px solid #237227' : '1px solid rgba(35,114,39,0.3)',
                                                        color: (skillLevels[skill] || 'Beginner') === lvl ? '#F0FFDF' : 'rgba(240,255,223,0.5)',
                                                    }}>{lvl}</button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={saveSkills}
                            disabled={savingSkills || selectedSkills.length === 0}
                            style={{
                                padding: '11px 28px', borderRadius: 10, fontWeight: 700,
                                fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                                background: skillsSaved ? '#237227' : 'linear-gradient(135deg,#237227,#1a5a1a)',
                                border: 'none', color: '#F0FFDF',
                                opacity: selectedSkills.length === 0 ? 0.5 : 1,
                                boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                            }}
                        >
                            {savingSkills ? '⏳ Saving…' : skillsSaved ? '✓ Saved!' : '💾 Save Skills'}
                        </button>
                    </div>
                )}

                {/* ─── TAB 1: Repos ─── */}
                {activeTab === 1 && (
                    <div style={cardStyle}>
                        <h2 style={{ color: '#F0FFDF', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>
                            GitHub Repositories
                        </h2>
                        <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.85rem', marginBottom: 20 }}>
                            Paste repo URLs — we'll scrape the tech stack and README.
                        </p>

                        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                            <input
                                type="url"
                                value={repoUrl}
                                onChange={e => setRepoUrl(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && scrapeRepo()}
                                placeholder="https://github.com/username/repo"
                                style={{
                                    flex: 1, padding: '11px 16px', borderRadius: 10,
                                    background: '#2B2A2A', border: '1px solid rgba(35,114,39,0.25)',
                                    color: '#F0FFDF', fontSize: '0.875rem', outline: 'none',
                                }}
                            />
                            <button
                                onClick={scrapeRepo}
                                disabled={scrapingRepo || !repoUrl.trim()}
                                style={{
                                    padding: '11px 22px', borderRadius: 10, fontWeight: 700,
                                    fontSize: '0.875rem', cursor: 'pointer',
                                    background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                                    border: 'none', color: '#F0FFDF',
                                    opacity: scrapingRepo || !repoUrl.trim() ? 0.6 : 1,
                                }}
                            >
                                {scrapingRepo ? '⏳' : '+ Add'}
                            </button>
                        </div>

                        {repoError && (
                            <p style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: 12 }}>⚠ {repoError}</p>
                        )}

                        {repos.length === 0 ? (
                            <div style={{
                                border: '1px dashed rgba(35,114,39,0.25)', borderRadius: 12,
                                padding: '40px 20px', textAlign: 'center',
                                color: 'rgba(240,255,223,0.3)', fontSize: '0.9rem',
                            }}>
                                🐙 No repos added yet — paste a GitHub URL above
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {repos.map((repo, i) => (
                                    <div key={i} style={{
                                        background: '#252525', border: '1px solid rgba(35,114,39,0.2)',
                                        borderRadius: 12, padding: '16px 20px',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                            <div>
                                                <p style={{ color: '#A8E063', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
                                                    {repo.name || repo.url}
                                                </p>
                                                <p style={{ color: 'rgba(240,255,223,0.55)', fontSize: '0.8rem', marginBottom: 8 }}>
                                                    {repo.description || 'No description'}
                                                </p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    {(repo.techStack || []).map(t => (
                                                        <span key={t} style={{
                                                            background: 'rgba(35,114,39,0.15)', border: '1px solid rgba(35,114,39,0.3)',
                                                            borderRadius: 99, padding: '2px 9px', fontSize: '0.72rem',
                                                            fontWeight: 600, color: '#A8E063',
                                                        }}>{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            {repo.stars !== undefined && (
                                                <div style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                    ⭐ {repo.stars}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── TAB 2: Resume ─── */}
                {activeTab === 2 && (
                    <div style={cardStyle}>
                        <h2 style={{ color: '#F0FFDF', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>
                            Upload Resume
                        </h2>
                        <p style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.85rem', marginBottom: 20 }}>
                            Upload your PDF resume — Gemini will extract your skills, achievements, and experience.
                        </p>

                        {/* Drop zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${resumeFile ? '#237227' : 'rgba(35,114,39,0.3)'}`,
                                borderRadius: 14, padding: '48px 20px', textAlign: 'center',
                                cursor: 'pointer', transition: 'all 0.2s',
                                background: resumeFile ? 'rgba(35,114,39,0.08)' : 'transparent',
                                marginBottom: 20,
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📄</div>
                            <p style={{ color: '#F0FFDF', fontWeight: 600, marginBottom: 4 }}>
                                {resumeFile ? resumeFile.name : 'Click to select PDF'}
                            </p>
                            <p style={{ color: 'rgba(240,255,223,0.4)', fontSize: '0.8rem' }}>
                                {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : 'Maximum file size: 5 MB'}
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={e => setResumeFile(e.target.files?.[0] || null)}
                        />

                        {resumeError && (
                            <p style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: 12 }}>⚠ {resumeError}</p>
                        )}

                        <button
                            onClick={handleResumeUpload}
                            disabled={uploading || !resumeFile}
                            style={{
                                padding: '11px 28px', borderRadius: 10, fontWeight: 700,
                                fontSize: '0.9rem', cursor: 'pointer',
                                background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                                border: 'none', color: '#F0FFDF',
                                opacity: (!resumeFile || uploading) ? 0.5 : 1,
                                boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                                marginBottom: 24,
                            }}
                        >
                            {uploading ? '⏳ Parsing…' : '🚀 Parse Resume'}
                        </button>

                        {resumeResult && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {['skills', 'achievements', 'experience'].map(section => (
                                    resumeResult[section]?.length > 0 && (
                                        <div key={section} style={{
                                            background: '#252525', border: '1px solid rgba(35,114,39,0.2)',
                                            borderRadius: 12, padding: 18,
                                        }}>
                                            <p style={{ color: '#A8E063', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                                {section}
                                            </p>
                                            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                {resumeResult[section].map((item, i) => (
                                                    <li key={i} style={{ color: 'rgba(240,255,223,0.75)', fontSize: '0.85rem', display: 'flex', gap: 8 }}>
                                                        <span style={{ color: '#237227' }}>▸</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                    <button
                        onClick={() => navigate('/assessment')}
                        style={{
                            padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
                            background: 'linear-gradient(135deg,#237227,#1a5a1a)',
                            border: 'none', color: '#F0FFDF', cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(35,114,39,0.3)',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}
                    >
                        Go to Assessment →
                    </button>
                </div>
            </div>
        </div>
    );
}
