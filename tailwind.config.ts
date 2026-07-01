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
        cream: "#F5EFE4",
        porcelain: "#FFFDF8",
        ink: "#1E1E1B",
        smoke: "#5F5A50",
        gold: "#C9A227",
        moss: "#70856A",
        rosewood: "#8F5D4D"
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Avenir Next", "Helvetica Neue", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(34, 30, 22, 0.11)",
        glow: "0 0 40px rgba(201, 162, 39, 0.32)"
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        flame: "flame 2.8s ease-in-out infinite",
        rise: "rise 12s linear infinite"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(-0.6deg)" },
          "50%": { transform: "translate3d(0, -12px, 0) rotate(0.6deg)" }
        },
        flame: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.08) translateY(-2px)", opacity: "1" }
        },
        rise: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "18%": { opacity: "0.8" },
          "100%": { transform: "translateY(-120px)", opacity: "0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
