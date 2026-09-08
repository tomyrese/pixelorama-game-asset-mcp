import { ArtDirectionSpec } from "@pixelorama/art-direction";

export interface DetectedAsset {
  path: string;
  category: string;
  width?: number;
  height?: number;
}

export interface ProjectInspectionResult {
  rootPath: string;
  engine: "godot" | "unity" | "generic";
  hasArtDirectionJson: boolean;
  artDirection: ArtDirectionSpec;
  detectedAssets: DetectedAsset[];
  suggestedTileSize: number;
  suggestedCharacterScale: number;
}
