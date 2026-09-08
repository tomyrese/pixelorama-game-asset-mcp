import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { AssetManifest, AssetManifestRecord } from "./types.js";

export function loadOrCreateManifest(manifestPath: string, projectName: string): AssetManifest {
  if (existsSync(manifestPath)) {
    try {
      const data = JSON.parse(readFileSync(manifestPath, "utf-8"));
      return data as AssetManifest;
    } catch {}
  }

  return {
    schemaVersion: "1.0.0",
    project: projectName,
    lastUpdated: new Date().toISOString(),
    assets: {}
  };
}

export function updateManifestAsset(
  manifest: AssetManifest,
  record: AssetManifestRecord
): AssetManifest {
  const updatedAssets = { ...manifest.assets };
  updatedAssets[record.id] = record;

  const sortedAssetKeys = Object.keys(updatedAssets).sort();
  const sortedAssets: Record<string, AssetManifestRecord> = {};
  for (const key of sortedAssetKeys) {
    sortedAssets[key] = updatedAssets[key];
  }

  return {
    ...manifest,
    lastUpdated: new Date().toISOString(),
    assets: sortedAssets
  };
}

export function saveManifest(manifestPath: string, manifest: AssetManifest): void {
  const dir = dirname(manifestPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}
