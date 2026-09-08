export type EngineTarget = "generic" | "godot" | "unity" | "phaser";

export interface ExportBundlePaths {
  sourcePxo: string;
  runtimeSpritesheet: string;
  metadataJson: string;
  godotResource?: string;
  previewPng?: string;
}

export interface AnimationMetadataEntry {
  name: string;
  direction: string;
  fps: number;
  loop: boolean;
  frames: Array<{
    frameIndex: number;
    rect: { x: number; y: number; width: number; height: number };
    duration: number;
  }>;
}

export interface AssetExportMetadata {
  id: string;
  name: string;
  type: string;
  frameWidth: number;
  frameHeight: number;
  sheetWidth: number;
  sheetHeight: number;
  columns: number;
  rows: number;
  anchor: { x: number; y: number };
  pivot: { x: number; y: number };
  animations: AnimationMetadataEntry[];
  exportedAt: string;
}
