import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy brand (kept for backward compat with tests)
        brand: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
        // New pastel palette
        pastel: {
          lavender: { DEFAULT: "#c4b5fd", dark: "#8b5cf6", light: "#ede9fe" },
          peach:    { DEFAULT: "#fda4af", dark: "#f43f5e", light: "#ffe4e6" },
          mint:     { DEFAULT: "#6ee7b7", dark: "#10b981", light: "#d1fae5" },
          sky:      { DEFAULT: "#7dd3fc", dark: "#0ea5e9", light: "#e0f2fe" },
          amber:    { DEFAULT: "#fcd34d", dark: "#f59e0b", light: "#fef3c7" },
          cream:    { DEFAULT: "#fef9f0", soft: "#fff7ed" },
        },
        accent: {
          warm: "#FF6B6B",
          cool: "#4ECDC4",
          gold: "#FFD93D",
          purple: "#6C5CE7",
          pink: "#FD79A8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "dot-pulse": "dotPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        dotPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.7" },
        },
      },
      boxShadow: {
        "soft": "0 4px 24px rgba(0,0,0,0.06)",
        "card": "0 2px 16px rgba(0,0,0,0.08)",
        "lavender": "0 8px 32px rgba(196,181,253,0.4)",
        "peach": "0 8px 32px rgba(253,164,175,0.4)",
        "mint": "0 8px 32px rgba(110,231,183,0.4)",
        "sky": "0 8px 32px rgba(125,211,252,0.4)",
        "amber": "0 8px 32px rgba(252,211,77,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
