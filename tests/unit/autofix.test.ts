import { describe, it, expect } from "vitest";
import { generateAutoFixPlan, DefectDiagnostic } from "@pixelorama/validation-engine";

describe("AutoFix", () => {
  it("generates repair commands for stray orphan pixels", () => {
    const diagnostics: DefectDiagnostic[] = [
      {
        type: "stray_pixel",
        message: "Stray pixel",
        frameIndex: 0,
        layerIndex: 1,
        coords: { x: 5, y: 12 }
      }
    ];

    const plan = generateAutoFixPlan(diagnostics);
    expect(plan.fixCommands.length).toBe(3);
    expect(plan.fixCommands[0]).toEqual({ command: "frame.select", frameIndex: 0 });
    expect(plan.fixCommands[1]).toEqual({ command: "layer.select", layerIndex: 1 });
    expect(plan.fixCommands[2]).toEqual({
      command: "draw.erase",
      pixels: [{ x: 5, y: 12 }],
      mode: "live"
    });
  });
});
