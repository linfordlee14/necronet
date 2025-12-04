/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                necro: {
                    bg: '#0d0d0d',
                    card: '#1a1a2e',
                    surface: '#16213e',
                    green: '#00ff41',
                    purple: '#9d4edd',
                    orange: '#ff6b35',
                    text: '#e0e0e0',
                    muted: '#888888',
                },
            },
            animation: {
                'ghost-float': 'ghostFloat 3s ease-in-out infinite',
                'ghost-spin': 'ghostSpin 2s linear infinite',
            },
            keyframes: {
                ghostFloat: {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    },
                    '50%': {
                        transform: 'translateY(-10px)'
                    },
                },
                ghostSpin: {
                    '0%': {
                        transform: 'rotate(0deg)'
                    },
                    '100%': {
                        transform: 'rotate(360deg)'
                    },
                },
            },
        },
    },
    plugins: [],
};