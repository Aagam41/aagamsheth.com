/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.hbs", "./index.html"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        ink: "#1A1A1A",
        muted: "#666666",
        accent: "#A03C3C",
        hairline: "#E5E5E5",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "50%",
      },
    },
  },
  plugins: [],
};
