import { BridgeCommand } from "@pixelorama/protocol";

export type CheckSeverity = "error" | "warning" | "info";

export interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  severity: CheckSeverity;
  details?: unknown;
}

export interface DefectDiagnostic {
  type:
    | "identical_frames"
    | "fake_translated_animation"
    | "empty_frame"
    | "stray_pixel"
    | "bounds_mismatch"
    | "seam_error"
    | "disallowed_alpha";
  message: string;
  frameIndex?: number;
  layerIndex?: number;
  coords?: { x: number; y: number };
}

export interface ValidationReport {
  passed: boolean;
  status: "PASS" | "FAIL";
  checks: CheckResult[];
  diagnostics: DefectDiagnostic[];
}

export interface AutoFixPlan {
  diagnostics: DefectDiagnostic[];
  fixCommands: BridgeCommand[];
}
