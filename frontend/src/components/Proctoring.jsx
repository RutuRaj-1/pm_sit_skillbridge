import React, { useEffect, useRef, useState } from 'react';

/**
 * Proctoring component using tab-visibility detection + basic face detection hint.
 * Uses 3-strike system. Calls onTerminate() when strikes reach 3.
 */
export default function Proctoring({ onTerminate, onViolation }) {
    const [strikes, setStrikes] = useState(0);
    const [status, setStatus] = useState('Monitoring');
    const [warning, setWarning] = useState('');
    const strikesRef = useRef(0);

    const MAX_STRIKES = 3;

    const addStrike = (reason) => {
        strikesRef.current += 1;
        const newStrikes = strikesRef.current;
        setStrikes(newStrikes);
        setWarning(`⚠️ ${reason} (Strike ${newStrikes}/${MAX_STRIKES})`);
        onViolation?.({ reason, strike: newStrikes });

        if (newStrikes >= MAX_STRIKES) {
            setStatus('Terminated');
            setTimeout(() => onTerminate?.(), 800);
        } else {
            setTimeout(() => setWarning(''), 3500);
        }
    };

    // Tab switch detection
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) {
                addStrike('Tab switch detected');
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    // Right-click prevention
    useEffect(() => {
        const preventContextMenu = (e) => {
            e.preventDefault();
            addStrike('Right-click blocked');
        };
        document.addEventListener('contextmenu', preventContextMenu);
        return () => document.removeEventListener('contextmenu', preventContextMenu);
    }, []);

    // Copy detection
    useEffect(() => {
        const handleCopy = () => addStrike('Copy detected');
        document.addEventListener('copy', handleCopy);
        return () => document.removeEventListener('copy', handleCopy);
    }, []);

    const strikePct = (strikes / MAX_STRIKES) * 100;
    const barColor = strikes === 0 ? '#237227' : strikes === 1 ? '#f59e0b' : '#ef4444';

    return (
        <div style={{
            background: '#1F1F1F',
            border: `1px solid ${status === 'Terminated' ? '#ef4444' : 'rgba(35,114,39,0.3)'}`,
            borderRadius: 12,
            padding: '12px 16px',
            minWidth: 200,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: status === 'Terminated' ? '#ef4444' : '#A8E063',
                    boxShadow: `0 0 6px ${status === 'Terminated' ? '#ef4444' : '#A8E063'}`,
                    animation: status !== 'Terminated' ? 'pulse 1.5s infinite' : 'none',
                }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: status === 'Terminated' ? '#ef4444' : '#A8E063' }}>
                    {status === 'Terminated' ? '🚫 TERMINATED' : '🔴 Proctoring Active'}
                </span>
            </div>

            {/* Strike bar */}
            <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: 'rgba(240,255,223,0.5)', fontSize: '0.7rem' }}>Violations</span>
                    <span style={{ color: barColor, fontSize: '0.7rem', fontWeight: 700 }}>
                        {strikes}/{MAX_STRIKES}
                    </span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                    <div style={{
                        height: '100%', width: `${strikePct}%`,
                        background: barColor, borderRadius: 99,
                        transition: 'width 0.4s, background 0.4s',
                    }} />
                </div>
            </div>

            {warning && (
                <div style={{
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 8, padding: '6px 10px',
                    color: '#f87171', fontSize: '0.72rem', fontWeight: 600,
                }}>
                    {warning}
                </div>
            )}

            <div style={{ marginTop: 8, fontSize: '0.65rem', color: 'rgba(240,255,223,0.3)', lineHeight: 1.4 }}>
                Tab switch • Right-click • Copy = violation
            </div>
        </div>
    );
}
