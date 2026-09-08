import { describe, it, expect } from "vitest";
import { createCharacterSpec } from "@pixelorama/asset-spec";
import { resolveArtDirection } from "@pixelorama/art-direction";
import { planPixelArt } from "@pixelorama/pixel-art-planner";
import { planAnimationSequences } from "@pixelorama/animation-planner";

describe("Knight Asset Spec & Planning", () => {
  it("creates a 4-direction knight asset spec with 40 total frames", () => {
    const spec = createCharacterSpec({
      id: "player_knight",
      name: "Cozy Knight",
      width: 32,
      height: 32,
      animations: ["idle", "walk"],
      directions: ["down", "left", "right", "up"]
    });

    expect(spec.animations.length).toBe(8);
    const totalFrames = spec.animations.reduce((sum, a) => sum + a.frameCount, 0);
    expect(totalFrames).toBe(40);

    const artDirection = resolveArtDirection("cozy_farm_32");
    const artPlan = planPixelArt(spec, artDirection);
    expect(artPlan.stages.length).toBe(4);
    expect(artPlan.stages.map((s) => s.layerName)).toEqual(["shadow", "body", "clothing", "hair"]);

    const animPlans = planAnimationSequences(spec, artDirection);
    expect(animPlans.length).toBe(8);

    for (const anim of animPlans) {
      expect(anim.keyframes.length).toBe(anim.frameCount);
      for (const kf of anim.keyframes) {
        expect(kf.layerUpdates.length).toBe(3);
        for (const update of kf.layerUpdates) {
          expect(update.pixels.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
