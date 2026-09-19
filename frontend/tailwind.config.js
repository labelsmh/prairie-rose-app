/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAF7F2',
        deepteal: '#0D3B45',
        sky: '#1DA9C4',
        sage: '#7FA85E',
        terracotta: '#EDA05F',
        mauve: '#A2669B',
      },
    },
  },
  plugins: [],
}