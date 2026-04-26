import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        surface: "#13171c",
        border: "#222831",
        accent: "#4f9dff",
      },
    },
  },
  plugins: [],
};

export default config;
