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
          50: '#FBF8EE',
          100: '#F5EED5',
          200: '#EBDCA8',
          300: '#DFC77B',
          400: '#D4AF37', // Haute Joaillerie Signature Gold
          500: '#B89020',
          600: '#947014',
          700: '#73540E',
          800: '#543C0C',
          900: '#3D2B0B',
          950: '#241804',
        },
        roseGold: {
          100: '#FAF0EE',
          200: '#F6DFDC',
          300: '#F4C2C2', // Signature Blush Watercolor
          400: '#E8A598', // Champagne Rose
          500: '#D9897A',
          600: '#B86555',
        },
        celestial: {
          100: '#F2F5FC',
          200: '#E1E8F8',
          300: '#C8D5F2', // Lilac Sky Watercolor
          400: '#A4B8E6',
        },
        obsidian: {
          700: '#2A2A2E',
          750: '#222226',
          800: '#1A1A1E',
          850: '#141417',
          900: '#0E0E11',
          950: '#070709',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F7F3EA',
          300: '#EFE8D8',
          400: '#E2D7C0',
          500: '#CFC0A0',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
