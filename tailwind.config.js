/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      fontFamily: {
        chillaxextralight: ["Chillax-Extralight"],
        chillaxlight: ["Chillax-Light"],
        chillaxregular: ["Chillax-Regular"],
        chillaxsemibold: ['Chillax-Semibold']
      },
    },
  },
  plugins: [],
};
