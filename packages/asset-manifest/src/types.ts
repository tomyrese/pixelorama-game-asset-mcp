import { AssetExportMetadata } from "@pixelorama/export-manager";

export interface AssetManifestRecord {
  id: string;
  sourcePxo: string;
  runtimeFiles: string[];
  metadata: AssetExportMetadata;
  validationStatus: "PASS" | "FAIL";
  version: number;
}

export interface AssetManifest {
  schemaVersion: string;
  project: string;
  lastUpdated: string;
  assets: Record<string, AssetManifestRecord>;
}
