// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <--- questo è fondamentale
  ],
  theme: {
    extend: {
      fontFamily: {
        marker: ['"Permanent Marker"', 'cursive'],
      },
    },
  },
  plugins: [],
};