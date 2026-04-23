module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        primary: 'hsl(142, 76%, 36%)', // green
        primaryBg: 'hsl(142, 71%, 45% / 0.1)',
        secondary: '#f97316', // orange
        bg: 'hsl(210, 50%, 98%)',
        card: '#ffffff',
        muted: 'hsl(218, 11%, 65%)',
        destructive: 'hsl(0, 84%, 60%)',
      },
      borderRadius: {
        card: '16px',
        button: '10px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        cardHover: '0 8px 24px rgba(0,0,0,0.12)',
        cta: '0 4px 12px rgba(0,150,0,0.2)',
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease forwards',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: '200px 0' },
        },
      },
    },
  },
  plugins: [],
};
