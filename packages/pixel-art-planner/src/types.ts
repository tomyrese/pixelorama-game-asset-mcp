import { PixelTuple, PixelRun, Rect2D } from "@pixelorama/shared";

export type ArtworkStage = "shadow" | "silhouette" | "base_color" | "shading" | "detail" | "cleanup";

export interface StageDrawingBatch {
  stage: ArtworkStage;
  layerIndex: number;
  layerName: string;
  frameIndex: number;
  pixels: PixelTuple[];
  runs: PixelRun[];
  rects?: Array<{ rect: Rect2D; color: string; filled: boolean }>;
  cursorPosition: { x: number; y: number };
  tool: string;
  primaryColor: string;
}

export interface PixelArtPlan {
  assetId: string;
  width: number;
  height: number;
  palette: Array<{ name: string; hex: string; role?: string }>;
  layers: string[];
  stages: StageDrawingBatch[];
}
