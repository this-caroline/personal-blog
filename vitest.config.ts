import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@components": path.resolve("./src/components"),
      "@config": path.resolve("./src/config"),
      "@layouts": path.resolve("./src/layouts"),
      "@lib": path.resolve("./src/lib"),
      "@styles": path.resolve("./src/styles"),
    },
  },
});
