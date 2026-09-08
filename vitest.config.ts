import { defineConfig } from "vitest/config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    testTimeout: 20000
  },
  resolve: {
    alias: {
      "@pixelorama/shared": resolve(__dirname, "packages/shared/src/index.ts"),
      "@pixelorama/protocol": resolve(__dirname, "packages/protocol/src/index.ts"),
      "@pixelorama/art-direction": resolve(__dirname, "packages/art-direction/src/index.ts"),
      "@pixelorama/asset-spec": resolve(__dirname, "packages/asset-spec/src/index.ts"),
      "@pixelorama/pixel-art-planner": resolve(__dirname, "packages/pixel-art-planner/src/index.ts"),
      "@pixelorama/animation-planner": resolve(__dirname, "packages/animation-planner/src/index.ts"),
      "@pixelorama/ui-planner": resolve(__dirname, "packages/ui-planner/src/index.ts"),
      "@pixelorama/project-inspector": resolve(__dirname, "packages/project-inspector/src/index.ts"),
      "@pixelorama/validation-engine": resolve(__dirname, "packages/validation-engine/src/index.ts"),
      "@pixelorama/export-manager": resolve(__dirname, "packages/export-manager/src/index.ts"),
      "@pixelorama/asset-manifest": resolve(__dirname, "packages/asset-manifest/src/index.ts"),
      "@pixelorama/workflow-engine": resolve(__dirname, "packages/workflow-engine/src/index.ts"),
      "@pixelorama/client-config": resolve(__dirname, "packages/client-config/src/index.ts"),
      "@pixelorama/pixelorama-bridge": resolve(__dirname, "packages/pixelorama-bridge/src/index.ts")
    }
  }
});
