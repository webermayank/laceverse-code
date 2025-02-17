/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust the path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A8D5BA", // Sage Green
        secondary: "#F4EAE6", // Soft Sand
        accent: "#F3CAC3", // Blush Pink
        background: "#5C4033", // Earthy Brown
        ui: "#F5F5DC", // Light Beige
      },
      //add font family to the theme
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "serif"],
        mono: ["Menlo", "monospace"],
        sigmar: ["Sigmar"],
        lilita: ["Lilita One", "serif"],
      },
    },
  },
  plugins: [],
};
