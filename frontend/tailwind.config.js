/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      cursor:{
        pencil: "url(../public/assets/pencil-cursor.png), default",
      }
    },
  },
  plugins: [],
}