import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark base
        ink: {
          950: '#0a0907',
          900: '#0f0e0d',
          800: '#1a1814',
          700: '#2a2520',
          600: '#443c32',
          500: '#665e52',
        },
        // Gold accent
        gold: {
          DEFAULT: '#c9b89a',
          light: '#f0e8d8',
          dark: '#a09282',
          muted: '#665e52',
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
