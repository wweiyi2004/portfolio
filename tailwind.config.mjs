/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#6366f1", fg: "#a5b4fc" } },
    },
  },
  plugins: [],
};
