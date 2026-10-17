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
        rcorp: {
          primary: '#4F46E5',
          'primary-hover': '#4338CA',
          secondary: '#7C3AED',
          accent: '#06B6D4',
          success: '#22C55E',
          warning: '#EAB308',
          error: '#EF4444',
          dark: {
            900: '#0B0F19',
            800: '#111827',
            700: '#1F2937',
            600: '#374151'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
