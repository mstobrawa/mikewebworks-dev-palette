import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#050816",
        panel: "#0d1327",
        line: "#1a2640",
        ink: "#f4f7fb",
        muted: "#94a3b8",
        glow: "#7dd3fc"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(5, 8, 22, 0.45)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
