import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { resolveArtDirection, ArtDirectionSpecSchema } from "@pixelorama/art-direction";
import { ProjectInspectionResult, DetectedAsset } from "./types.js";

export function inspectGameProject(workspacePath: string): ProjectInspectionResult {
  const isGodot = existsSync(join(workspacePath, "project.godot"));
  const isUnity = existsSync(join(workspacePath, "ProjectSettings", "ProjectSettings.asset"));
  const engine = isGodot ? "godot" : isUnity ? "unity" : "generic";

  const artDirectionFile = join(workspacePath, "art-direction.json");
  let hasArtDirectionJson = false;
  let artDirection = resolveArtDirection("cozy_farm_32");

  if (existsSync(artDirectionFile)) {
    try {
      const raw = JSON.parse(readFileSync(artDirectionFile, "utf-8"));
      const parsed = ArtDirectionSpecSchema.safeParse(raw);
      if (parsed.success) {
        artDirection = parsed.data;
        hasArtDirectionJson = true;
      }
    } catch {}
  }

  const detectedAssets: DetectedAsset[] = [];
  const candidateDirs = ["assets", "art", "sprites", "textures", "resources", "public"];

  for (const dirName of candidateDirs) {
    const fullDir = join(workspacePath, dirName);
    if (existsSync(fullDir) && statSync(fullDir).isDirectory()) {
      try {
        const files = readdirSync(fullDir, { recursive: true });
        for (const file of files) {
          const filePath = typeof file === "string" ? file : file.toString();
          if (filePath.endsWith(".png") || filePath.endsWith(".pxo")) {
            detectedAssets.push({
              path: join(dirName, filePath),
              category: dirName
            });
            if (detectedAssets.length >= 50) break;
          }
        }
      } catch {}
    }
  }

  return {
    rootPath: workspacePath,
    engine,
    hasArtDirectionJson,
    artDirection,
    detectedAssets,
    suggestedTileSize: artDirection.baseTileSize,
    suggestedCharacterScale: artDirection.characterScale
  };
}
