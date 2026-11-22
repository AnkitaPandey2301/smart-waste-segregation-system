/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#030a06',
          900: '#06150d',
          850: '#091f14',
          800: '#0d2b1c',
          700: '#133d28',
          600: '#1b5438',
          500: '#26734d',
        },
        cyber: {
          green: '#10b981',
          lime: '#4ade80',
          neon: '#00ff87',
          mint: '#6ee7b7',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          danger: '#ef4444',
          blue: '#3b82f6',
          purple: '#a855f7'
        }
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(0, 255, 135, 0.25)',
        'neon-glow-lg': '0 0 35px rgba(0, 255, 135, 0.45)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(74, 222, 128, 0.15)',
        'cyber-card-active': '0 8px 32px 0 rgba(0, 255, 135, 0.15), inset 0 0 0 1px rgba(0, 255, 135, 0.4)',
        'danger-glow': '0 0 25px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'scanline': 'scanline 6s linear infinite',
        'conveyor': 'conveyor 2s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        conveyor: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 0' },
        }
      }
    },
  },
  plugins: [],
}
