import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    clearMocks: true,
    restoreMocks: true,
    fileParallelism: false,
    setupFiles: ["./src/tests/setup.ts"],
    exclude: [...configDefaults.exclude, "**/dist/**"]
  },
});
