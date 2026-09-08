import { describe, it, expect } from "vitest";
import { validateHorizontalSeam, PixelBuffer } from "@pixelorama/validation-engine";

describe("SeamQA", () => {
  it("passes when left and right edges match exactly", () => {
    const w = 32;
    const h = 16;
    const data = new Uint8Array(w * h * 4);

    for (let y = 0; y < h; y++) {
      const leftIdx = (y * w + 0) * 4;
      const rightIdx = (y * w + (w - 1)) * 4;

      data[leftIdx] = 120;
      data[leftIdx + 1] = 80;
      data[leftIdx + 2] = 40;
      data[leftIdx + 3] = 255;

      data[rightIdx] = 120;
      data[rightIdx + 1] = 80;
      data[rightIdx + 2] = 40;
      data[rightIdx + 3] = 255;
    }

    const buffer: PixelBuffer = { width: w, height: h, data };
    const res = validateHorizontalSeam(buffer);

    expect(res.checks[0].passed).toBe(true);
    expect(res.diagnostics.length).toBe(0);
  });

  it("fails when left and right edges have seam mismatch", () => {
    const w = 32;
    const h = 16;
    const data = new Uint8Array(w * h * 4);

    for (let y = 0; y < h; y++) {
      const leftIdx = (y * w + 0) * 4;
      const rightIdx = (y * w + (w - 1)) * 4;

      data[leftIdx] = 255;
      data[leftIdx + 1] = 0;
      data[leftIdx + 2] = 0;
      data[leftIdx + 3] = 255;

      data[rightIdx] = 0;
      data[rightIdx + 1] = 0;
      data[rightIdx + 2] = 255;
      data[rightIdx + 3] = 255;
    }

    const buffer: PixelBuffer = { width: w, height: h, data };
    const res = validateHorizontalSeam(buffer);

    expect(res.checks[0].passed).toBe(false);
    expect(res.diagnostics.length).toBeGreaterThan(0);
  });
});
