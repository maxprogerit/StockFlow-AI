import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#070A13",
        card: "#0F1629",
        neon: {
          blue: "#2D8CFF",
          purple: "#8A4DFF"
        }
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at top right, rgba(45,140,255,0.35), transparent 45%), radial-gradient(circle at bottom left, rgba(138,77,255,0.28), transparent 42%)"
      },
      boxShadow: {
        glass: "0 8px 32px rgba(31, 38, 135, 0.37)"
      }
    }
  },
  plugins: [tailwindcssAnimate]
} satisfies Config;

