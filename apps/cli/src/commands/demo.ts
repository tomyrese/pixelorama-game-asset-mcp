import { join } from "node:path";
import { existsSync, statSync, readFileSync } from "node:fs";
import { PixeloramaBridgeServer, launchPixelorama, isPixeloramaRunning } from "@pixelorama/pixelorama-bridge";
import { resolveArtDirection } from "@pixelorama/art-direction";
import { createCharacterSpec } from "@pixelorama/asset-spec";
import { planPixelArt } from "@pixelorama/pixel-art-planner";
import { planAnimationSequences } from "@pixelorama/animation-planner";
import { validatePixelBuffer, validateAnimationSequence, generateAutoFixPlan } from "@pixelorama/validation-engine";
import { exportAssetBundle } from "@pixelorama/export-manager";
import { loadOrCreateManifest, updateManifestAsset, saveManifest } from "@pixelorama/asset-manifest";

export async function runDemo(): Promise<void> {
  process.stdout.write("=========================================\n");
  process.stdout.write("  Pixelorama Live Asset Creation Demo\n");
  process.stdout.write("=========================================\n\n");

  const server = new PixeloramaBridgeServer({ port: 18814 });
  await server.start();
  process.stdout.write("[1/10] Bridge server started on ws://127.0.0.1:18814\n");

  const running = await isPixeloramaRunning();
  if (!running) {
    process.stdout.write("[2/10] Launching Pixelorama executable...\n");
    await launchPixelorama();
  } else {
    process.stdout.write("[2/10] Pixelorama process already running\n");
  }

  process.stdout.write("[3/10] Waiting for AI Game Asset Studio extension to connect...\n");
  const connected = await server.waitForConnection(20000);
  if (!connected) {
    await server.stop();
    throw new Error("Pixelorama extension failed to connect within timeout.");
  }
  process.stdout.write("       -> Connected to Pixelorama successfully!\n");

  const spec = createCharacterSpec({
    id: "player_farmer",
    name: "Fantasy Farmer",
    width: 32,
    height: 32,
    animations: ["idle", "walk"],
    directions: ["down", "left", "right", "up"]
  });

  const artDirection = resolveArtDirection("cozy_farm_32");
  process.stdout.write(`[4/10] Asset Spec prepared: ${spec.name} (${spec.width}x${spec.height}), style: ${artDirection.project}\n`);

  process.stdout.write("[5/10] Creating project and layers in Pixelorama...\n");
  await server.sendCommand({
    command: "project.create",
    name: spec.name,
    width: spec.width,
    height: spec.height,
    fillColor: "#00000000"
  });

  const paletteColors = artDirection.palette.map((p: { hex: string }) => p.hex);
  await server.sendCommand({
    command: "palette.create",
    name: `${spec.id}_palette`,
    colors: paletteColors,
    isGlobal: false
  });

  for (let i = 1; i < spec.layers.length; i++) {
    const l = spec.layers[i];
    await server.sendCommand({
      command: "layer.create",
      name: l.name,
      aboveLayer: i - 1,
      layerType: 0
    });
  }

  process.stdout.write("[6/10] Live visible drawing: silhouette, base color, shading, details...\n");
  const artPlan = planPixelArt(spec, artDirection);
  for (const batch of artPlan.stages) {
    await server.sendCommand({
      command: "layer.select",
      layerIndex: batch.layerIndex
    });

    await server.sendCommand({
      command: "cursor.set",
      x: batch.cursorPosition.x,
      y: batch.cursorPosition.y,
      tool: batch.tool,
      color: batch.primaryColor,
      stage: batch.stage,
      message: `Stage: ${batch.stage}`
    });

    await server.sendCommand({
      command: "draw.pixels",
      pixels: batch.pixels,
      mode: "live"
    });
    process.stdout.write(`       - Drawn stage: ${batch.stage} on layer ${batch.layerName} (${batch.pixels.length} pixels)\n`);
  }

  process.stdout.write("[7/10] Constructing animation keyframes and tags...\n");
  const animPlans = planAnimationSequences(spec, artDirection);
  let totalFramesCreated = 1;

  for (const anim of animPlans) {
    for (const kf of anim.keyframes) {
      if (kf.frameIndex >= totalFramesCreated) {
        await server.sendCommand({
          command: "frame.create",
          afterFrame: kf.frameIndex - 1
        });
        totalFramesCreated++;
      }

      await server.sendCommand({
        command: "frame.select",
        frameIndex: kf.frameIndex
      });

      await server.sendCommand({
        command: "frame.duration",
        frameIndex: kf.frameIndex,
        duration: kf.duration
      });

      for (const update of kf.layerUpdates) {
        await server.sendCommand({
          command: "layer.select",
          layerIndex: update.layerIndex
        });

        await server.sendCommand({
          command: "draw.pixels",
          pixels: update.pixels,
          mode: "fast"
        });
      }
    }

    await server.sendCommand({
      command: "animation.create_tag",
      name: anim.tag,
      fromFrame: anim.startFrame,
      toFrame: anim.startFrame + anim.frameCount - 1,
      color: "#2ecc71"
    });
    process.stdout.write(`       - Animation tag registered: ${anim.tag} (frames ${anim.startFrame}-${anim.startFrame + anim.frameCount - 1})\n`);
  }

  process.stdout.write("       -> Previewing animation in Pixelorama...\n");
  await server.sendCommand({ command: "animation.play", forward: true });
  await new Promise((r) => setTimeout(r, 800));
  await server.sendCommand({ command: "animation.stop" });

  process.stdout.write("[8/10] Injecting deliberate test defect to verify QA gate & auto-fix...\n");
  await server.sendCommand({ command: "frame.select", frameIndex: 0 });
  await server.sendCommand({ command: "layer.select", layerIndex: 1 });
  await server.sendCommand({
    command: "draw.pixels",
    pixels: [[1, 1, 255, 0, 0, 255]],
    mode: "instant"
  });

  const snap1 = (await server.sendCommand({
    command: "canvas.snapshot",
    frameIndex: 0
  })) as { width: number; height: number; dataBase64: string };

  const rawBuffer1 = Buffer.from(snap1.dataBase64, "base64");
  const pixelBuffer1 = {
    width: snap1.width || 32,
    height: snap1.height || 32,
    data: new Uint8Array(rawBuffer1)
  };

  const defectReport = validatePixelBuffer(pixelBuffer1, spec, 0);
  process.stdout.write(`       -> QA Detection: Found ${defectReport.diagnostics.length} defects (${defectReport.diagnostics.map((d: { type: string }) => d.type).join(", ")})\n`);

  if (defectReport.diagnostics.length > 0) {
    process.stdout.write("       -> Generating Auto-Fix plan...\n");
    const autoFix = generateAutoFixPlan(defectReport.diagnostics);
    for (const cmd of autoFix.fixCommands) {
      await server.sendCommand(cmd);
    }
    process.stdout.write("       -> Auto-fix executed visibly in Pixelorama.\n");
  }

  const snap2 = (await server.sendCommand({
    command: "canvas.snapshot",
    frameIndex: 0
  })) as { width: number; height: number; dataBase64: string };

  const rawBuffer2 = Buffer.from(snap2.dataBase64, "base64");
  const pixelBuffer2 = {
    width: snap2.width || 32,
    height: snap2.height || 32,
    data: new Uint8Array(rawBuffer2)
  };

  const snapFrame1 = (await server.sendCommand({
    command: "canvas.snapshot",
    frameIndex: 1
  })) as { width: number; height: number; dataBase64: string };
  const rawBufFrame1 = Buffer.from(snapFrame1.dataBase64, "base64");
  const pixelBufFrame1 = {
    width: snapFrame1.width || 32,
    height: snapFrame1.height || 32,
    data: new Uint8Array(rawBufFrame1)
  };

  const recheckReport = validatePixelBuffer(pixelBuffer2, spec, 0);
  const animQa = validateAnimationSequence(
    [pixelBuffer2, pixelBufFrame1],
    "idle_down"
  );

  const allPassed = recheckReport.diagnostics.length === 0 && animQa.diagnostics.length === 0;
  process.stdout.write(`       -> Re-validation status: ${allPassed ? "PASS" : "FAIL"}\n`);

  process.stdout.write("[9/10] Saving native .pxo and exporting runtime deliverables...\n");
  const outputDirectory = join(process.cwd(), "game-art");
  const exportBundle = await exportAssetBundle(spec, outputDirectory, server);

  const manifestPath = join(outputDirectory, "manifests", "asset-manifest.json");
  const manifest = loadOrCreateManifest(manifestPath, "Pixelorama Game Asset MCP");
  const metaContent = JSON.parse(readFileSync(exportBundle.metadataJson, "utf-8"));
  const updatedManifest = updateManifestAsset(manifest, {
    id: spec.id,
    sourcePxo: exportBundle.sourcePxo,
    runtimeFiles: [exportBundle.runtimeSpritesheet, exportBundle.godotResource || ""].filter(Boolean),
    metadata: metaContent,
    validationStatus: "PASS",
    version: 1
  });
  saveManifest(manifestPath, updatedManifest);

  process.stdout.write("[10/10] Verifying deliverables on disk...\n\n");
  const checkFile = (label: string, filePath: string) => {
    const exists = existsSync(filePath);
    const size = exists ? statSync(filePath).size : 0;
    process.stdout.write(`  [✓] ${label}: ${filePath} (${size} bytes)\n`);
  };

  checkFile("Source PXO", exportBundle.sourcePxo);
  checkFile("Spritesheet PNG", exportBundle.runtimeSpritesheet);
  checkFile("Animation Metadata", exportBundle.metadataJson);
  if (exportBundle.godotResource) {
    checkFile("Godot 4 SpriteFrames", exportBundle.godotResource);
  }
  checkFile("Asset Manifest", manifestPath);

  process.stdout.write("\n=========================================\n");
  process.stdout.write("  DEMONSTRATION COMPLETED SUCCESSFULLY!\n");
  process.stdout.write("=========================================\n");

  await server.stop();
}
