const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "light-blue": colors.sky,
        cyan: colors.cyan,
        ming: "#006D77",
        "middle-blue-green": "#83C5BE",
        "alice-blue": "#EDF6F9",
        carmine: "#A44A3F",
        salmon: "#F19C79",
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ["last"],
      animation: ["hover", "focus"],
    },
  },
  plugins: [],
};
