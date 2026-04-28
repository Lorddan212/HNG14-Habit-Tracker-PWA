import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3150fe",
        indigo: "#2b2598",
        magenta: "#dd36b6",
        lavender: "#7570be",
        surface: "var(--surface)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        success: "var(--success)",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ambient: "0 8px 32px rgba(26, 27, 34, 0.06)",
        glass: "0 18px 60px rgba(43, 37, 152, 0.12)",
        lift: "0 22px 70px rgba(49, 80, 254, 0.18)",
      },
      backgroundImage: {
        "cta-gradient": "linear-gradient(135deg, #3150fe 0%, #2b2598 100%)",
        "editorial-wash":
          "radial-gradient(circle at 20% 10%, rgba(221, 54, 182, 0.20), transparent 30%), radial-gradient(circle at 88% 0%, rgba(49, 80, 254, 0.20), transparent 32%), linear-gradient(145deg, #f6f7ff 0%, #eef0ff 46%, #fdf8ff 100%)",
        "header-gradient":
          "linear-gradient(135deg, rgba(49, 80, 254, 0.96) 0%, rgba(43, 37, 152, 0.94) 62%, rgba(221, 54, 182, 0.72) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
