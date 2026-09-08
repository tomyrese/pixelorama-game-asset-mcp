import { describe, it, expect } from "vitest";
import {
  validateAnimationSequence,
  PixelBuffer
} from "@pixelorama/validation-engine";

function createDummyBuffer(w: number, h: number, fillVal: number): PixelBuffer {
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = fillVal;
    data[i * 4 + 1] = fillVal;
    data[i * 4 + 2] = fillVal;
    data[i * 4 + 3] = 255;
  }
  return { width: w, height: h, data };
}

describe("AnimationQA - Fake Animation Detection", () => {
  it("fails when consecutive frames are identical", () => {
    const frame1 = createDummyBuffer(16, 16, 100);
    const frame2 = createDummyBuffer(16, 16, 100);
    const frame3 = createDummyBuffer(16, 16, 100);

    const qa = validateAnimationSequence([frame1, frame2, frame3], "walk");
    const distinctCheck = qa.checks.find((c) => c.name === "animation_walk_distinct_frames");

    expect(distinctCheck).toBeDefined();
    expect(distinctCheck?.passed).toBe(false);
    expect(qa.diagnostics.length).toBeGreaterThan(0);
    expect(qa.diagnostics[0].type).toBe("identical_frames");
  });

  it("passes when frames have authentic movement differences", () => {
    const frame1 = createDummyBuffer(16, 16, 50);
    const frame2 = createDummyBuffer(16, 16, 120);
    const frame3 = createDummyBuffer(16, 16, 200);

    const qa = validateAnimationSequence([frame1, frame2, frame3], "walk");
    const distinctCheck = qa.checks.find((c) => c.name === "animation_walk_distinct_frames");

    expect(distinctCheck).toBeDefined();
    expect(distinctCheck?.passed).toBe(true);
    expect(qa.diagnostics.length).toBe(0);
  });
});
