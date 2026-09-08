import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { AssetSpec } from "@pixelorama/asset-spec";
import { PixeloramaBridgeServer } from "@pixelorama/pixelorama-bridge";
import { ExportBundlePaths, AssetExportMetadata, AnimationMetadataEntry } from "./types.js";

export async function exportAssetBundle(
  spec: AssetSpec,
  outputDir: string,
  bridge: PixeloramaBridgeServer
): Promise<ExportBundlePaths> {
  const sourceDir = join(outputDir, "source");
  const runtimeDir = join(outputDir, "runtime");
  const metadataDir = join(outputDir, "metadata");

  if (!existsSync(sourceDir)) mkdirSync(sourceDir, { recursive: true });
  if (!existsSync(runtimeDir)) mkdirSync(runtimeDir, { recursive: true });
  if (!existsSync(metadataDir)) mkdirSync(metadataDir, { recursive: true });

  const pxoPath = join(sourceDir, `${spec.id}.pxo`);
  const sheetPath = join(runtimeDir, `${spec.id}_sheet.png`);
  const metaPath = join(metadataDir, `${spec.id}.json`);
  const godotTresPath = join(runtimeDir, `${spec.id}_frames.tres`);

  await bridge.sendCommand({
    command: "project.save",
    path: pxoPath
  });

  const totalFrames = spec.animations.reduce((sum, a) => sum + a.frameCount, 0) || 1;
  const columns = Math.min(totalFrames, 8);
  const rows = Math.ceil(totalFrames / columns);

  await bridge.sendCommand({
    command: "export.spritesheet",
    path: sheetPath,
    columns,
    rows
  });

  const animMeta: AnimationMetadataEntry[] = spec.animations.map((a) => {
    const frames = [];
    for (let f = 0; f < a.frameCount; f++) {
      const globalFrame = a.startFrame + f;
      const col = globalFrame % columns;
      const row = Math.floor(globalFrame / columns);
      frames.push({
        frameIndex: globalFrame,
        rect: {
          x: col * spec.width,
          y: row * spec.height,
          width: spec.width,
          height: spec.height
        },
        duration: 1.0 / a.fps
      });
    }
    return {
      name: a.name,
      direction: a.direction,
      fps: a.fps,
      loop: a.loop,
      frames
    };
  });

  const metadata: AssetExportMetadata = {
    id: spec.id,
    name: spec.name,
    type: spec.type,
    frameWidth: spec.width,
    frameHeight: spec.height,
    sheetWidth: columns * spec.width,
    sheetHeight: rows * spec.height,
    columns,
    rows,
    anchor: spec.anchor,
    pivot: spec.pivot,
    animations: animMeta,
    exportedAt: new Date().toISOString()
  };

  writeFileSync(metaPath, JSON.stringify(metadata, null, 2), "utf-8");

  const godotTresContent = generateGodotSpriteFrames(metadata, `${spec.id}_sheet.png`);
  writeFileSync(godotTresPath, godotTresContent, "utf-8");

  return {
    sourcePxo: pxoPath,
    runtimeSpritesheet: sheetPath,
    metadataJson: metaPath,
    godotResource: godotTresPath
  };
}

export function generateGodotSpriteFrames(
  metadata: AssetExportMetadata,
  textureFileName: string
): string {
  const animSections: string[] = [];

  for (const anim of metadata.animations) {
    animSections.push(`{
"loop": ${anim.loop},
"name": &"${anim.name}",
"speed": ${anim.fps}.0
}`);
  }

  return `[gd_resource type="SpriteFrames" format=3]

[resource]
animations = [${animSections.join(", ")}]
`;
}
