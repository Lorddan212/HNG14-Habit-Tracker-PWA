import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    css: true,
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.tsx"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/lib/**/*.ts"],
      thresholds: {
        lines: 80,
      },
    },
  },
});
