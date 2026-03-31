import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './app/layouts/**/*.vue',
    './pages/**/*.vue',
    './app/pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app/plugins/**/*.{js,ts}',
    './app.vue',
    './app/app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#e8eef9',
          100: '#c5d4f0',
          200: '#91aee3',
          300: '#5d87d6',
          400: '#3b63c4',
          500: '#284a9e',
          600: '#1f3b82',
          700: '#1a316c',
          800: '#142856',
          900: '#0f1f45',
          950: '#0a1530',
        },
        night: {
          950: '#05080f',
          900: '#0a0f1a',
          850: '#0d1424',
          800: '#111a2e',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'mesh-dark':
          'radial-gradient(ellipse 120% 80% at 20% -20%, rgba(40, 74, 158, 0.35), transparent 50%), radial-gradient(ellipse 90% 60% at 100% 0%, rgba(30, 58, 138, 0.25), transparent 45%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(15, 31, 69, 0.4), transparent 50%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glass-lg':
          '0 24px 64px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        royal: '0 0 40px rgba(40, 74, 158, 0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
