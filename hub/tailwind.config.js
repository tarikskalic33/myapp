/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hub: {
          bg:      '#08090C',
          surface: '#0F1117',
          border:  '#1A1D27',
          text:    '#EDEAE3',
          muted:   '#6B6E80',
          accent:  '#6366F1',
          glow:    '#818CF8',
        },
      },
    },
  },
  plugins: [],
}
