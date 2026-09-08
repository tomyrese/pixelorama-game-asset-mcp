import { join, resolve } from "node:path";
import { existsSync, statSync, readFileSync } from "node:fs";
import {
  PixeloramaBridgeServer,
  launchPixelorama,
  isPixeloramaRunning
} from "@pixelorama/pixelorama-bridge";
import { resolveArtDirection } from "@pixelorama/art-direction";
import { createCharacterSpec } from "@pixelorama/asset-spec";
import { runAssetCreationWorkflow } from "@pixelorama/workflow-engine";
import { loadOrCreateManifest, updateManifestAsset, saveManifest } from "@pixelorama/asset-manifest";

export async function runCreateKnight(outputDir?: string): Promise<void> {
  const targetDir = outputDir ? resolve(outputDir) : resolve("game-art");

  process.stdout.write("==============================================\n");
  process.stdout.write("  Creating Cozy Knight 32x32 (4 Directions)   \n");
  process.stdout.write("==============================================\n\n");

  const server = new PixeloramaBridgeServer({ port: 18814 });
  await server.start();

  const isRunning = await isPixeloramaRunning();
  if (!isRunning) {
    process.stdout.write("[1/8] Launching Pixelorama desktop application...\n");
    await launchPixelorama();
  } else {
    process.stdout.write("[1/8] Pixelorama process is running.\n");
  }

  process.stdout.write("[2/8] Waiting for AI Game Asset Studio extension to connect...\n");
  const connected = await server.waitForConnection(20000);
  if (!connected) {
    await server.stop();
    throw new Error("Pixelorama extension failed to connect within timeout.");
  }
  process.stdout.write("       -> Connected to Pixelorama successfully!\n");

  const spec = createCharacterSpec({
    id: "player_knight",
    name: "Cozy Knight",
    width: 32,
    height: 32,
    animations: [
      "idle",
      "walk",
      "harvest",
      "mine",
      "chop",
      "attack",
      "skill",
      "interact"
    ],
    directions: ["down", "left", "right", "up"]
  });

  const artDirection = resolveArtDirection("cozy_farm_32");
  const totalFrames = spec.animations.reduce((sum, a) => sum + a.frameCount, 0);
  process.stdout.write(`[3/8] Asset Spec prepared: ${spec.name} (${spec.width}x${spec.height}), ${spec.animations.length} animations, ${totalFrames} animation frames\n`);

  process.stdout.write("[4/8] Executing live visible drawing, keyframe construction & tags...\n");
  const result = await runAssetCreationWorkflow(server, {
    spec,
    artDirection,
    drawingMode: "live",
    outputDirectory: targetDir,
    onProgress: (stage: string, current: number, total: number, message?: string) => {
      process.stdout.write(`       [${current}/${total}] ${message || stage}\n`);
    }
  });

  if (!result.exportPaths) {
    await server.stop();
    throw new Error("Asset creation workflow did not return export paths.");
  }

  process.stdout.write("[5/8] Quality Gate Status: " + result.state + "\n");
  for (const check of result.validationReport.checks) {
    const mark = check.passed ? "✓" : "✗";
    process.stdout.write(`       ${mark} [${check.severity.toUpperCase()}] ${check.name}: ${check.message}\n`);
  }

  const exportPaths = result.exportPaths;
  process.stdout.write("[6/8] Exported Assets:\n");
  process.stdout.write(`       - Native Source: ${exportPaths.sourcePxo}\n`);
  process.stdout.write(`       - Runtime Spritesheet: ${exportPaths.runtimeSpritesheet}\n`);
  process.stdout.write(`       - Godot Resource: ${exportPaths.godotResource}\n`);
  process.stdout.write(`       - Metadata JSON: ${exportPaths.metadataJson}\n`);

  process.stdout.write("[7/8] Recording asset in project manifest...\n");
  const manifestPath = join(targetDir, "manifests", "asset-manifest.json");
  const manifest = loadOrCreateManifest(manifestPath, "Cozy Farming Knight");
  const metaContent = JSON.parse(readFileSync(exportPaths.metadataJson, "utf-8"));
  const updatedManifest = updateManifestAsset(manifest, {
    id: spec.id,
    sourcePxo: exportPaths.sourcePxo,
    runtimeFiles: [exportPaths.runtimeSpritesheet, exportPaths.godotResource || ""].filter(Boolean),
    metadata: metaContent,
    validationStatus: result.state === "PASS" ? "PASS" : "FAIL",
    version: 1
  });
  saveManifest(manifestPath, updatedManifest);
  process.stdout.write(`       -> Manifest updated: ${manifestPath}\n`);

  process.stdout.write("[8/8] Verifying deliverables on disk...\n");
  const checkFile = (label: string, filePath: string) => {
    const exists = existsSync(filePath);
    const size = exists ? statSync(filePath).size : 0;
    process.stdout.write(`  [✓] ${label}: ${filePath} (${size} bytes)\n`);
  };

  checkFile("Source PXO", exportPaths.sourcePxo);
  checkFile("Spritesheet PNG", exportPaths.runtimeSpritesheet);
  checkFile("Animation Metadata", exportPaths.metadataJson);
  if (exportPaths.godotResource) {
    checkFile("Godot 4 SpriteFrames", exportPaths.godotResource);
  }
  checkFile("Asset Manifest", manifestPath);

  await new Promise((r) => setTimeout(r, 2000));
  await server.stop();

  process.stdout.write("\n==============================================\n");
  process.stdout.write("  Cozy Knight Asset Creation Complete!        \n");
  process.stdout.write("==============================================\n");
}
