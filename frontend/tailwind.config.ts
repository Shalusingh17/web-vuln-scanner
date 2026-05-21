import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class", "class"],

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",

      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* Severity colors */
        critical: "hsl(var(--critical))",
        high: "hsl(var(--high))",
        medium: "hsl(var(--medium))",
        low: "hsl(var(--low))",
        info: "hsl(var(--info))",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },

          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },

        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },

          to: {
            height: "0",
          },
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },

          "100%": {
            backgroundPosition: "200% 0",
          },
        },

        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(0, 229, 255, 0.6), inset 0 0 20px rgba(0, 229, 255, 0.2)",
          },
        },

        "cyber-glow": {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(0, 229, 255, 0.4), inset 0 0 15px rgba(0, 229, 255, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(0, 229, 255, 0.7), inset 0 0 25px rgba(0, 229, 255, 0.2)",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px)",
          },
          "50%": {
            transform: "translateY(-20px) translateX(10px)",
          },
        },

        "gradient-shift": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "cyber-glow": "cyber-glow 2.5s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
      },
    },
  },

  plugins: [tailwindcssAnimate],
};

export default config;