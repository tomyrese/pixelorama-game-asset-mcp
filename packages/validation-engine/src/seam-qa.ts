import { CheckResult, DefectDiagnostic } from "./types.js";
import { PixelBuffer } from "./deterministic-qa.js";

export function validateHorizontalSeam(
  buffer: PixelBuffer
): { checks: CheckResult[]; diagnostics: DefectDiagnostic[] } {
  const checks: CheckResult[] = [];
  const diagnostics: DefectDiagnostic[] = [];

  let seamMismatches = 0;
  for (let y = 0; y < buffer.height; y++) {
    const leftIdx = (y * buffer.width + 0) * 4;
    const rightIdx = (y * buffer.width + (buffer.width - 1)) * 4;

    const lr = buffer.data[leftIdx];
    const lg = buffer.data[leftIdx + 1];
    const lb = buffer.data[leftIdx + 2];
    const la = buffer.data[leftIdx + 3];

    const rr = buffer.data[rightIdx];
    const rg = buffer.data[rightIdx + 1];
    const rb = buffer.data[rightIdx + 2];
    const ra = buffer.data[rightIdx + 3];

    if (lr !== rr || lg !== rg || lb !== rb || la !== ra) {
      seamMismatches++;
    }
  }

  const isSeamless = seamMismatches === 0;
  checks.push({
    name: "horizontal_seamless",
    passed: isSeamless,
    severity: "error",
    message: isSeamless
      ? "Horizontal seamless alignment verified (left edge matches right edge)"
      : `Found ${seamMismatches} pixel color mismatches between left and right seams`
  });

  if (!isSeamless) {
    diagnostics.push({
      type: "seam_error",
      message: `Horizontal seam mismatch across ${seamMismatches} rows`
    });
  }

  return { checks, diagnostics };
}
