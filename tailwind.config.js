module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // indigo
        secondary: "#22D3EE", // cyan
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "zoom-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "zoom-slow": "zoom-slow 20s ease-in-out infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
