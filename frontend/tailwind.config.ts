import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "Inter", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          pink: "#ec4899",
          purple: "#8b5cf6",
          orange: "#f97316",
          sky: "#0ea5e9",
        },
        news: {
          red: "#ef4444",
          breaking: "#dc2626",
        },
      },
      animation: {
        ticker:    "ticker 40s linear infinite",
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up":"slideUp 0.3s ease-out",
        "pop-in":  "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      },
      keyframes: {
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        card:  "0 2px 12px rgba(15,23,42,0.07), 0 1px 3px rgba(15,23,42,0.05)",
        hover: "0 12px 32px rgba(15,23,42,0.14), 0 4px 8px rgba(15,23,42,0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
