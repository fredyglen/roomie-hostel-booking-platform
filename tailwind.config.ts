
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'bricolage': ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        'sans': ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'], // Keep for backward compatibility
      },
      spacing: {
        '1': '0.5rem',   // 8px
        '2': '1rem',     // 16px
        '3': '1.5rem',   // 24px
        '4': '2rem',     // 32px
        '5': '2.5rem',   // 40px
        '6': '3rem',     // 48px
        '8': '4rem',     // 64px
        '10': '5rem',    // 80px
        '12': '6rem',    // 96px
        '16': '8rem',    // 128px
        '20': '10rem',   // 160px
      },
      colors: {
        roomi: {
          blue: {
            50: 'rgb(var(--roomi-blue-50))',
            100: 'rgb(var(--roomi-blue-100))',
            500: 'rgb(var(--roomi-blue-500))',
            600: 'rgb(var(--roomi-blue-600))',
            700: 'rgb(var(--roomi-blue-700))',
            900: 'rgb(var(--roomi-blue-900))',
          },
          teal: {
            50: 'rgb(var(--roomi-teal-50))',
            500: 'rgb(var(--roomi-teal-500))',
            600: 'rgb(var(--roomi-teal-600))',
          },
          orange: {
            50: 'rgb(var(--roomi-orange-50))',
            500: 'rgb(var(--roomi-orange-500))',
            600: 'rgb(var(--roomi-orange-600))',
          },
        },
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "6px",      // Reduced from 8px
        md: "4px",      // Reduced from 6px
        sm: "2px",      // Reduced from 4px
        DEFAULT: "4px", // Minimal rounding as default
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
