import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pergamino: "#F7F2E9",
        ebano: "#1C1714",
        "ebano-soft": "#2A2320",
        siena: "#B5623E",
        ceniza: "#9B8E85",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ["ui-monospace", '"SF Mono"', "Menlo", "monospace"],
      },
      letterSpacing: {
        wordmark: "0.45em",
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      maxWidth: {
        wrap: "1240px",
      },
    },
  },
  plugins: [],
};
export default config;
