import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const { login, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleChange = (e) => {
        clearError();
        setLocalError('');
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setLocalError('Please fill in all fields.');
            return;
        }
        const result = await login(form.email, form.password);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    const displayError = localError || error;

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-orb orb1" />
                <div className="auth-orb orb2" />
                <div className="auth-orb orb3" />
            </div>

            <div className="auth-card">
                {/* Logo / Brand */}
                <div className="auth-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="auth-logo" style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                        <img src="/logo.jpg" alt="SkillBridge Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h1 className="auth-title">SkillBridge</h1>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                {/* Error Banner */}
                {displayError && (
                    <div className="auth-error" role="alert">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {displayError}
                    </div>
                )}

                {/* Google Sign In */}
                <button
                    type="button"
                    className="auth-btn google-btn"
                    style={{
                        background: '#fff', color: '#333', borderColor: '#ddd',
                        marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Sign in with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <span style={{ padding: '0 10px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div className="field-group">
                        <label className="field-label" htmlFor="login-email">Email address</label>
                        <div className="field-input-wrap">
                            <span className="field-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span>
                            <input
                                id="login-email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="field-input"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="field-group">
                        <label className="field-label" htmlFor="login-password">Password</label>
                        <div className="field-input-wrap">
                            <span className="field-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="field-input"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="field-eye"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading} id="login-submit">
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner" />
                                Signing in…
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="auth-link">
                        Create one free
                    </Link>
                </p>
            </div>
        </div>
    );
}
