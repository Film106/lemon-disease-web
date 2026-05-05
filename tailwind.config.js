/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D5A27',
          light: '#3D7A35',
          dark: '#1E3D1A',
        },
        secondary: {
          DEFAULT: '#6B4226',
          light: '#8B5A36',
        },
        warning: '#D97706',
        danger: '#C0392B',
        bg: '#FAFAF7',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai Looped"', 'Sarabun', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
