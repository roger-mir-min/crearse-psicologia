/** @type {import('tailwindcss').Config} */
module.exports = {
  // prefix: 'tw-',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'md-x': '1040px',
        'md-lg': '1200px'
      },
      fontFamily: {
        'nunito': ['Nunito', 'serif'],
        'roboto': ['Roboto', 'sans'],
        'patua': ['PatuaOne'],
        'zarid': ['Zarid'],
        'julius': ['Julius']
      },
      colors: {
        'cr-blue-light': '#EBFAF9',
        'cr-blue': '#3C7CAA',
        'cr-blue2': '#9BC1DD',
        'cr-blue3': '#396888',
        'cr-purple': '#ab9eff',
        'cr-dark-gray': 'rgb(63,63,63)',
        'cr-dark-gray-dark': 'rgb(40, 40, 40)',
        'cr-dark-bg': 'rgb(18, 18, 18)',
        'cr-dark-purple': 'rgb(166, 136, 250)',
        'cr-dark-purple-light': 'rgb(186, 159, 251)'
      },
      borderColor: theme => ({
        'cr-blue': theme('colors.cr-blue'),
      })
    },
  },
  plugins: [require("daisyui"),
    require("tailwindcss"),
  require('autoprefixer')],
}

