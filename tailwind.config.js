module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './pages/Beranda.jsx',
  ],
  theme: {
    extend: {
      colors: {
        'merah': '#dc2626',
        'merah-gelap': '#991b1b',
        'hitam': '#0a0a0a',
        'abu-card': '#171717',
        'abu-border': '#333333',
        'abu-gelap': '#171717',
        'abu-sedang': '#262626',
        'abu-terang': '#d1d5db',
        'putih': '#ffffff'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease',
        'slide-up': 'slideUp 0.5s ease',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}