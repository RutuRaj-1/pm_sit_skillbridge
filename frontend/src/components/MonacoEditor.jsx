import React from 'react';
import Editor from '@monaco-editor/react';

/**
 * Monaco Editor wrapper for code assessment questions.
 * Props: language, value, onChange, height
 */
export default function MonacoEditor({ language = 'python', value = '', onChange, height = '220px' }) {
    return (
        <div style={{
            border: '1px solid rgba(35,114,39,0.35)',
            borderRadius: 10,
            overflow: 'hidden',
        }}>
            <div style={{
                background: '#1a1a1a',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderBottom: '1px solid rgba(35,114,39,0.2)',
            }}>
                <span style={{ fontSize: '0.72rem', color: '#A8E063', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {language}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'rgba(240,255,223,0.3)' }}>— Write your solution below</span>
            </div>
            <Editor
                height={height}
                language={language}
                value={value}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderLineHighlight: 'line',
                    tabSize: 4,
                    wordWrap: 'on',
                    automaticLayout: true,
                    padding: { top: 10, bottom: 10 },
                }}
            />
        </div>
    );
}
