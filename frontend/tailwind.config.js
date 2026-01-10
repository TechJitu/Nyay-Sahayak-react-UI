/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#020408',
          panel: 'rgba(10, 20, 35, 0.85)',
          input: '#0f172a',
        },
        accent: {
          gold: '#FFD700',
          cyan: '#00F3FF',
          danger: '#FF2A2A',
          success: '#00FF9D',
        },
        glass: {
          border: 'rgba(0, 242, 255, 0.2)',
        }
      },
      fontFamily: {
        legal: ['Cinzel', 'serif'],
        tech: ['Rajdhani', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      animation: {
        'red-pulse': 'red-pulse 2s infinite',
        'scan': 'scan 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'spin-slow': 'spin 10s linear infinite',
      },
      keyframes: {
        'red-pulse': {
          '0%, 100%': { boxShadow: 'inset 0 0 0 rgba(255, 0, 0, 0)' },
          '50%': { boxShadow: 'inset 0 0 50px rgba(255, 0, 60, 0.5)' },
        },
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}