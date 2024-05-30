// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        retroPurple: '#8A2BE2',    // Bright purple
        retroPink: '#FF69B4',      // Hot pink
        retroYellow: '#FFD700',    // Gold
        retroBlue: '#00BFFF',      // Deep sky blue
        retroWhite: '#F0F0FF',     // Slightly blue-tinted white
        retroDark: '#1E0933',      // Very dark purple (for backgrounds)
      },
      fontFamily: {
        retro: ['VT323', 'monospace'],
        retroHeading: ['Press Start 2P', 'monospace'],
      },
      boxShadow: {
        retro: '0 0 10px #FF69B4, inset 0 0 10px #8A2BE2',
        retroGlow: '0 0 5px #FFD700',
      },
    },
  },
  plugins: [],
};

export default config;