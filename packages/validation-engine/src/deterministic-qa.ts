import { AssetSpec } from "@pixelorama/asset-spec";
import { CheckResult, DefectDiagnostic } from "./types.js";

export interface PixelBuffer {
  width: number;
  height: number;
  data: Uint8Array;
}

export function validatePixelBuffer(
  buffer: PixelBuffer,
  spec: AssetSpec,
  frameIndex = 0
): { checks: CheckResult[]; diagnostics: DefectDiagnostic[] } {
  const checks: CheckResult[] = [];
  const diagnostics: DefectDiagnostic[] = [];

  const dimMatch = buffer.width === spec.width && buffer.height === spec.height;
  checks.push({
    name: "dimensions",
    passed: dimMatch,
    severity: "error",
    message: dimMatch
      ? `Dimensions match expected ${spec.width}x${spec.height}`
      : `Dimension mismatch: got ${buffer.width}x${buffer.height}, expected ${spec.width}x${spec.height}`
  });

  if (!dimMatch) {
    diagnostics.push({
      type: "bounds_mismatch",
      message: `Canvas size ${buffer.width}x${buffer.height} does not match spec ${spec.width}x${spec.height}`,
      frameIndex
    });
  }

  let nonZeroAlphaCount = 0;
  let semiTransparentCount = 0;
  const strayPixels: Array<{ x: number; y: number }> = [];

  const getPixelAlpha = (x: number, y: number): number => {
    if (x < 0 || x >= buffer.width || y < 0 || y >= buffer.height) return 0;
    return buffer.data[(y * buffer.width + x) * 4 + 3];
  };

  for (let y = 0; y < buffer.height; y++) {
    for (let x = 0; x < buffer.width; x++) {
      const idx = (y * buffer.width + x) * 4;
      const a = buffer.data[idx + 3];

      if (a > 0) {
        nonZeroAlphaCount++;
        if (a > 0 && a < 255) {
          semiTransparentCount++;
        }

        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (getPixelAlpha(x + dx, y + dy) > 0) {
              neighbors++;
            }
          }
        }
        if (neighbors === 0) {
          strayPixels.push({ x, y });
        }
      }
    }
  }

  const notEmpty = nonZeroAlphaCount > 0;
  checks.push({
    name: "non_empty",
    passed: notEmpty,
    severity: "error",
    message: notEmpty ? `Frame has ${nonZeroAlphaCount} visible pixels` : "Frame is completely empty"
  });

  if (!notEmpty) {
    diagnostics.push({
      type: "empty_frame",
      message: "Canvas or frame contains no visible pixels",
      frameIndex
    });
  }

  if (!spec.validationRules.allowSemiTransparency) {
    const noSemi = semiTransparentCount === 0;
    checks.push({
      name: "pixel_integrity_alpha",
      passed: noSemi,
      severity: "error",
      message: noSemi
        ? "No anti-aliased or semi-transparent pixels detected"
        : `Found ${semiTransparentCount} unexpected semi-transparent pixels`
    });
    if (!noSemi) {
      diagnostics.push({
        type: "disallowed_alpha",
        message: `Found ${semiTransparentCount} semi-transparent pixels, which violates crisp pixel art constraints`,
        frameIndex
      });
    }
  }

  const noStrays = strayPixels.length === 0;
  checks.push({
    name: "stray_orphan_pixels",
    passed: noStrays,
    severity: "warning",
    message: noStrays ? "No orphan stray noise pixels found" : `Found ${strayPixels.length} orphan noise pixels`
  });

  for (const stray of strayPixels) {
    diagnostics.push({
      type: "stray_pixel",
      message: `Stray isolated pixel found at (${stray.x}, ${stray.y})`,
      frameIndex,
      coords: stray
    });
  }

  return { checks, diagnostics };
}
