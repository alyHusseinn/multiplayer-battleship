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
      }
    },
  },
  plugins: [],
}