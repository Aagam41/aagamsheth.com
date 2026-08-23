/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.hbs", "./index.html"],
  theme: {
    extend: {
      colors: {
        accent: "#1772d0",
      },
      fontFamily: {
        sans: ["Inter", "'Segoe UI'", "'Helvetica Neue'", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
