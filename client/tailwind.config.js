/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bl': '#B9E5FE',
        'dbl': '#252944',
        'gr': '#B5FFE1',
        'gr-2': '#93E5AB',
        'gr-3': '#0CAC7D',
      },
    },
  },
  plugins: [],
}