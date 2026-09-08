import { QualityState, DrawingMode } from "@pixelorama/shared";
import { AssetSpec } from "@pixelorama/asset-spec";
import { ArtDirectionSpec } from "@pixelorama/art-direction";
import { ValidationReport } from "@pixelorama/validation-engine";
import { ExportBundlePaths } from "@pixelorama/export-manager";

export interface WorkflowRunOptions {
  spec: AssetSpec;
  artDirection: ArtDirectionSpec;
  drawingMode?: DrawingMode;
  outputDirectory: string;
  onProgress?: (stage: string, current: number, total: number, message?: string) => void;
}

export interface WorkflowRunResult {
  assetId: string;
  state: QualityState;
  validationReport: ValidationReport;
  exportPaths?: ExportBundlePaths;
  error?: string;
}
