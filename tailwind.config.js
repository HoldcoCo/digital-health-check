/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070b18',
          900: '#0b1226',
          800: '#121c38',
          700: '#1b2950',
        },
        brand: {
          300: '#8fb4ff',
          400: '#5d8dff',
          500: '#3b6cf6',
          600: '#2a4fd6',
        },
        spark: {
          300: '#7ff0d0',
          400: '#34e2ab',
          500: '#12c98d',
        },
        gold: {
          400: '#ffc861',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 60px -25px rgba(6, 12, 34, 0.85)',
        glow: '0 0 0 1px rgba(93, 141, 255, 0.45), 0 12px 40px -12px rgba(93, 141, 255, 0.55)',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floatUp: 'floatUp 0.45s ease-out both',
        pulseRing: 'pulseRing 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
