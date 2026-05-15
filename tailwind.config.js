module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#b3bcf5',
          DEFAULT: '#5c6ac4',
          dark: '#202e78',
        },
        teal: {
          light: '#64ffda',
          DEFAULT: '#1de9b6',
          dark: '#00bfa5',
        },
      },
    },
  },
  plugins: [],
};
