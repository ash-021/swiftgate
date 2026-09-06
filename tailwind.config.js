/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        slate: {
          950: "#020617",
        },
        brand: {
          400: "#36D1CB", // Lighter variant for hover
          500: "#25B2AD", // Primary logo color
          600: "#1C8F8A", // Darker variant
          900: "#093634", // Very dark
          950: "#041B1A",
        },
        emerald: { // Aliasing emerald to brand to re-theme without rewriting classes
          400: "#36D1CB",
          500: "#25B2AD", 
          600: "#1C8F8A",
          900: "#093634",
          950: "#041B1A",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
