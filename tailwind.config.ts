import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
    },
  },
};

export default config;
