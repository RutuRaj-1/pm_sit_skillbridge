import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/authApi';

const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Other'];
const INTERESTS = [
    'Full Stack Developer', 'Backend Developer', 'Frontend Developer',
    'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Cloud Architect',
    'Mobile Developer', 'Cybersecurity Engineer', 'Database Administrator',
    'AI Engineer', 'Blockchain Developer',
];
const COMPANIES = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
    'Infosys', 'TCS', 'Wipro', 'Accenture', 'IBM', 'Cognizant',
    'Startup', 'Other',
];

export default function ProfileSetup() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        college: '',
        branch: '',
        year: '',
        careerInterest: '',
        targetCompany: '',
        bio: '',
    });

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    }, [isAuthenticated, navigate]);

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const handleSubmit = async () => {
        if (!form.college || !form.branch || !form.careerInterest) {
            setError('Please complete all required fields.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await api.post('/profile/setup', {
                ...form,
                full_name: user?.full_name,
                email: user?.email,
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2B2A2A] flex items-center justify-center px-4 py-12">
            {/* Background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-[#237227] rounded-full blur-3xl opacity-10 top-0 right-0 animate-pulse" />
                <div className="absolute w-72 h-72 bg-[#1a5a1a] rounded-full blur-3xl opacity-10 bottom-0 left-0 animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="relative z-10 w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#237227] bg-opacity-15 border border-[#237227] border-opacity-30 rounded-full px-4 py-1.5 mb-4">
                        <span className="text-[#A8E063] text-sm font-semibold">Step {step} of 2</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#F0FFDF] mb-2">
                        {step === 1 ? '👋 Welcome, ' + (user?.full_name?.split(' ')[0] || 'there') + '!' : '🎯 Career Goals'}
                    </h1>
                    <p className="text-[#F0FFDF] text-opacity-60 text-sm">
                        {step === 1
                            ? "Let's set up your profile to personalize your experience"
                            : "Tell us what you're aiming for so we can guide you better"}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#1F1F1F] rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#237227] to-[#A8E063] transition-all duration-500"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                    />
                </div>

                {/* Card */}
                <div className="bg-[#1F1F1F] border border-[#237227] border-opacity-20 rounded-2xl p-8 shadow-glow">
                    {error && (
                        <div className="flex items-center gap-2 mb-6 p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-25 rounded-xl text-red-400 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="space-y-5">
                            {/* College */}
                            <div>
                                <label className="field-label">College / University *</label>
                                <input
                                    type="text"
                                    value={form.college}
                                    onChange={e => set('college', e.target.value)}
                                    placeholder="e.g. SIT Lonavala"
                                    className="w-full px-4 py-3 bg-[#2B2A2A] border border-[#237227] border-opacity-20 rounded-xl text-[#F0FFDF] placeholder-[#4a5560] outline-none focus:border-[#237227] focus:border-opacity-60 focus:ring-2 focus:ring-[#237227] focus:ring-opacity-20 transition-all text-sm"
                                />
                            </div>

                            {/* Branch */}
                            <div>
                                <label className="field-label">Branch / Stream *</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {BRANCHES.map(b => (
                                        <button
                                            key={b}
                                            type="button"
                                            onClick={() => set('branch', b)}
                                            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left
                        ${form.branch === b
                                                    ? 'bg-[#237227] bg-opacity-25 border-[#237227] text-[#A8E063]'
                                                    : 'bg-[#2B2A2A] border-[#237227] border-opacity-20 text-[#F0FFDF] text-opacity-75 hover:border-opacity-50'
                                                }`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="field-label">Current Year</label>
                                <div className="flex gap-2">
                                    {['1st', '2nd', '3rd', '4th', 'Graduated'].map(y => (
                                        <button
                                            key={y}
                                            type="button"
                                            onClick={() => set('year', y)}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                        ${form.year === y
                                                    ? 'bg-[#237227] bg-opacity-25 border-[#237227] text-[#A8E063]'
                                                    : 'bg-[#2B2A2A] border-[#237227] border-opacity-20 text-[#F0FFDF] text-opacity-75 hover:border-opacity-50'
                                                }`}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="field-label">Short Bio (optional)</label>
                                <textarea
                                    value={form.bio}
                                    onChange={e => set('bio', e.target.value)}
                                    placeholder="Tell us a bit about yourself..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#2B2A2A] border border-[#237227] border-opacity-20 rounded-xl text-[#F0FFDF] placeholder-[#4a5560] outline-none focus:border-[#237227] focus:border-opacity-60 focus:ring-2 focus:ring-[#237227] focus:ring-opacity-20 transition-all text-sm resize-none"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    if (!form.college || !form.branch) { setError('College and Branch are required.'); return; }
                                    setError(''); setStep(2);
                                }}
                                className="w-full py-3 bg-gradient-to-r from-[#237227] to-[#1a5a1a] text-[#F0FFDF] rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-glow flex items-center justify-center gap-2"
                            >
                                Continue →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Career Interest */}
                            <div>
                                <label className="field-label">Career Interest *</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {INTERESTS.map(i => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => set('careerInterest', i)}
                                            className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left
                        ${form.careerInterest === i
                                                    ? 'bg-[#237227] bg-opacity-25 border-[#237227] text-[#A8E063]'
                                                    : 'bg-[#2B2A2A] border-[#237227] border-opacity-20 text-[#F0FFDF] text-opacity-75 hover:border-opacity-50'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Company */}
                            <div>
                                <label className="field-label">Dream Company</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {COMPANIES.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => set('targetCompany', c)}
                                            className={`px-2 py-2.5 rounded-xl text-xs font-medium border transition-all text-center
                        ${form.targetCompany === c
                                                    ? 'bg-[#237227] bg-opacity-25 border-[#237227] text-[#A8E063]'
                                                    : 'bg-[#2B2A2A] border-[#237227] border-opacity-20 text-[#F0FFDF] text-opacity-75 hover:border-opacity-50'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 border border-[#237227] border-opacity-30 text-[#F0FFDF] text-opacity-70 rounded-xl font-semibold text-sm hover:bg-[#237227] hover:bg-opacity-10 transition-all"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={saving || !form.careerInterest}
                                    className="flex-2 flex-grow py-3 bg-gradient-to-r from-[#237227] to-[#1a5a1a] text-[#F0FFDF] rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <><span className="spinner" /> Saving…</>
                                    ) : (
                                        '🚀 Launch Dashboard'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skip */}
                <p className="text-center mt-4 text-sm text-[#F0FFDF] text-opacity-40">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-[#F0FFDF] hover:text-opacity-70 transition-colors underline underline-offset-2"
                    >
                        Skip for now
                    </button>
                </p>
            </div>
        </div>
    );
}
