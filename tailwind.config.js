const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-300': '#6b9bf1',
        'primary-500': '#3f80f3',
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: '0.625rem',
        '2vmin': 'calc(10px + 2vmin)',
      },
      gridTemplateColumns: {
        'autofit-100': 'repeat(auto-fit, minmax(100px, 1fr))',
        'autofit-200': 'repeat(auto-fit, minmax(200px, 1fr))',
        'autofit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
        'autofit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
}
