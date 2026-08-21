/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.hbs", "./index.html"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F6",
        ink: "#1A1A1A",
        muted: "#6B6558",
        accent: "#8B3A3A",
        hairline: "#E3DFD3",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
