const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
        pulse: "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 0.3 },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      colors: {
        primary: {
          50: "#F2EAFA",
          100: "#E4D4F4",
          200: "#C9A9E9",
          300: "#AE7EDE",
          400: "#9353D3",
          500: "#7828C8",
          600: "#6020A0",
          700: "#481878",
          800: "#301050",
          900: "#180828"
        },
      }
    }),
  ],
};

module.exports = config;
