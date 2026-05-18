/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D0D0D',
          surface: '#141414',
          elevated: '#1C1C1C',
          border: '#2A2A2A',
          'border-hover': '#3A3A3A',
        },
        accent: {
          amber: '#F59E0B',
          emerald: '#10B981',
          danger: '#EF4444',
        },
        text: {
          primary: '#F5F5F5',
          muted: '#737373',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        sm: '4px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
