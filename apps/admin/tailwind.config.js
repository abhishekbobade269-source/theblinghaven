/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#FBF7ED',
          200: '#F5ECDB',
          300: '#EBDCBF',
          400: '#DEC49B',
          500: '#C5A880', // Champagne Gold primary
          600: '#B08F60',
          700: '#8C6C42',
          800: '#6E5230',
          900: '#4F381F',
        },
        obsidian: {
          950: '#07080B',
          900: '#0B0D13', // Deep luxury dark background
          850: '#10141D',
          800: '#151A26', // Card surface
          750: '#1C2333',
          700: '#263044', // Dark border color
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F5F2EB', // Light mode background
          300: '#EFECE3',
          400: '#E2DCD2', // Light border
          500: '#D5CDC0',
          600: '#948B7D',
          700: '#635C50',
          800: '#3D382F',
          900: '#1F1C16',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
