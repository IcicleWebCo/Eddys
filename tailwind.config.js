/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#030226',
        'primary-teal': '#0396A6',
        'accent-mint': '#16F2CA',
        'accent-orange': '#F28B0C',
        'accent-red': '#F22929',
      },
    },
  },
  plugins: [],
};