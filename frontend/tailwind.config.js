export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: '#2B2A2A',
                surface: '#1F1F1F',
                card: '#252525',
                accent: '#237227',
                'accent-light': '#A8E063',
                primary: '#F0FFDF',
                muted: 'rgba(240,255,223,0.6)',
                border: 'rgba(35,114,39,0.25)',
            },
            fontFamily: {
                sans: ["'Outfit'", 'sans-serif'],
            },
            backgroundImage: {
                'gradient-accent': 'linear-gradient(135deg, #237227, #1a5a1a)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(35,114,39,0.3)',
                'glow-lg': '0 0 40px rgba(35,114,39,0.4)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};