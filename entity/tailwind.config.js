/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        e: {
          bg:      '#06060A',
          surface: '#0C0C12',
          raised:  '#111118',
          border:  '#1C1C26',
          text:    '#E8E6E0',
          muted:   '#52526A',
          dim:     '#2A2A38',
          amber:   '#F59E0B',
          amberDim:'#78490A',
          green:   '#10B981',
          red:     '#EF4444',
          blue:    '#60A5FA',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        glow: {
          '0%':   { textShadow: '0 0 4px #F59E0B40' },
          '100%': { textShadow: '0 0 12px #F59E0B80' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
