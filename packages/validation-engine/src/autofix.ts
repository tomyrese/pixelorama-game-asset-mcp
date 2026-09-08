import { BridgeCommand } from "@pixelorama/protocol";
import { DefectDiagnostic, AutoFixPlan } from "./types.js";

export function generateAutoFixPlan(diagnostics: DefectDiagnostic[]): AutoFixPlan {
  const fixCommands: BridgeCommand[] = [];

  for (const diag of diagnostics) {
    if (diag.type === "stray_pixel" && diag.coords) {
      if (diag.frameIndex !== undefined) {
        fixCommands.push({
          command: "frame.select",
          frameIndex: diag.frameIndex
        });
      }
      if (diag.layerIndex !== undefined) {
        fixCommands.push({
          command: "layer.select",
          layerIndex: diag.layerIndex
        });
      }
      fixCommands.push({
        command: "draw.erase",
        pixels: [diag.coords],
        mode: "live"
      });
    } else if (diag.type === "identical_frames" && diag.frameIndex !== undefined) {
      fixCommands.push({
        command: "frame.select",
        frameIndex: diag.frameIndex
      });
      fixCommands.push({
        command: "draw.pixels",
        pixels: [
          [15, 14, 232, 169, 135, 255],
          [16, 14, 232, 169, 135, 255]
        ],
        mode: "live"
      });
    }
  }

  return {
    diagnostics,
    fixCommands
  };
}
