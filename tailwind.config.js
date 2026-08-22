/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.hbs", "./index.html"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#333332",
        muted: "#666666",
        accent: "#2673B9",
        hairline: "#E5E5E5",
        highlight: "#FFF3A3",
      },
      fontFamily: {
        serif: ["Georgia", "'Times New Roman'", "serif"],
      },
      maxWidth: {
        page: "50%",
      },
    },
  },
  plugins: [],
};
