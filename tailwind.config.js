/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        border: "var(--border)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};
