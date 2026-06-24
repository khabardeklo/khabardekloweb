import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      minHeight: {
        '10': '2.5rem',
      },
      minWidth: {
        '10': '2.5rem',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
};

export default config;
