const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xxsm: '400px',
      xsm: '520px',
      sm: '640px',
      md: '768px',
      mobile: '992px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      whiteOpacity: '#ffffff1c',
      blue: '#3d71ff',
      black: '#000000',
      yellow: '#FEC700',
      green: '#00D800',
      purple: '#120028',
      purpleOpacity: '#120028a4',
      purpleDark: '#090411',
      purpleLight: '#4E00AD',
      purpleExtraLight: '#7300FF',
      red: '#FE0034',
      gray: '#666666',
    },
    extend: {
      fontFamily: {
        galano: ['var(--font-galanoGrotesque)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
