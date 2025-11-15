/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'duo-green': '#58CC02',
        'duo-blue': '#1CB0F6',
        'duo-purple': '#CE82FF',
        'duo-orange': '#FF9600',
        'duo-red': '#FF4B4B',
        'duo-yellow': '#FFC800',
        'duo-dark': '#131F24',
        'duo-gray': '#777777',
      },
    },
  },
  plugins: [],
}
