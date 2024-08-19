/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(209, 207, 213)',
        'secondary': 'rgb(77, 59, 81)',
        'sec-gray': '#b8b2b2',
        'ship': 'rgb(181, 103, 103)',
        'hit': 'rgb(137, 190, 137)',
        'not-hi': 'rgb(170, 165, 165)',
      }
    },
  },
  plugins: [],
}