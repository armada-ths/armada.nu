import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    screens: {
      xs: "470px",
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        melon: {
          700: "#00d790"
        },
        grape: {
          700: "#e73953"
        },
        liqorice: {
          700: "#2d2d2c"
        }
      },
      fontFamily: {
        "bebas-neue": ["var(--font-bebas-neue)"],
        lato: ["var(--font-lato)"],
        inter: ["var(--font-inter)"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")]
} satisfies Config

export default config
