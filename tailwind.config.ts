import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          gray: '#111827',
          red: '#120303',
          yellow: '#251203',
          green: '#021209',
          purple: '#170326',
          blue: '#080E21',
          orange: '#250B04',
          rose: '#26020D',
        }
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
