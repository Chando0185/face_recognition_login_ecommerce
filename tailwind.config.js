/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00d2ff',
          dark: '#00a8cc',
        },
        secondary: {
          DEFAULT: '#9d50bb',
          dark: '#6e48aa',
        },
        dark: {
          DEFAULT: '#0f172a',
          lighter: '#1e293b',
          card: 'rgba(30, 41, 59, 0.7)',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
