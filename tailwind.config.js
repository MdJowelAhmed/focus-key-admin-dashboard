/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C4A97D',
          hover: '#A88E63',
          ring: '#D8C4A1',
          soft: '#3D3322',
        },
        surface: {
          page: '#121214',
          sidebar: '#19191b',
          card: '#242429',
          elevated: '#2a2a30',
          input: '#ffffff',
          border: '#2e2e34',
        },
        accent: {
          pitch: '#16a34a',
          pitchSoft: '#14532d',
          success: '#22c55e',
          danger: '#ef4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
