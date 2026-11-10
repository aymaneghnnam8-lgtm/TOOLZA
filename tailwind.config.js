/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Segoe UI',
          'system-ui',
          '-apple-system',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.05), 0 1px 3px rgba(16, 24, 40, 0.04)',
        lift: '0 16px 40px rgba(16, 24, 40, 0.1)',
      },
      maxWidth: {
        page: '72rem',
      },
    },
  },
  plugins: [],
};
