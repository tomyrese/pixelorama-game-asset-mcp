import { AssetSpec } from "@pixelorama/asset-spec";
import { ArtDirectionSpec } from "@pixelorama/art-direction";
import { PixelRun } from "@pixelorama/shared";
import { runsToPixelTuples } from "@pixelorama/pixel-art-planner";
import { AnimationSequencePlan, AnimationKeyframe } from "./types.js";
import {
  getKnightIdleKeyframes,
  getKnightWalkKeyframes,
  getKnightHarvestKeyframes,
  getKnightMineKeyframes,
  getKnightChopKeyframes,
  getKnightAttackKeyframes,
  getKnightSkillKeyframes,
  getKnightInteractKeyframes
} from "./knight.js";

export function planAnimationSequences(
  spec: AssetSpec,
  artDirection: ArtDirectionSpec
): AnimationSequencePlan[] {
  const plans: AnimationSequencePlan[] = [];
  const palette = artDirection.palette;
  const isKnight = spec.id.includes("knight") || spec.name.toLowerCase().includes("knight");

  const clothBase = palette.find((p) => p.role === "clothing" && p.name.includes("Mid"))?.hex ?? "#3e5d7d";
  const clothShadow = palette.find((p) => p.role === "clothing" && p.name.includes("Dark"))?.hex ?? "#233852";
  const outline = palette.find((p) => p.role === "outline")?.hex ?? "#2b1c18";
  const skinBase = palette.find((p) => p.role === "skin" && p.name.includes("Mid"))?.hex ?? "#e8a987";
  const accent = palette.find((p) => p.role === "accent")?.hex ?? "#e0a867";
  const hairBase = palette.find((p) => p.role === "base")?.hex ?? "#7a4932";

  for (const anim of spec.animations) {
    const keyframes: AnimationKeyframe[] = [];
    const dir = (anim.direction as "down" | "left" | "right" | "up") || "down";

    if (isKnight) {
      if (anim.name.startsWith("idle")) {
        keyframes.push(...getKnightIdleKeyframes(dir, anim.startFrame, anim.fps));
      } else if (anim.name.startsWith("walk")) {
        keyframes.push(...getKnightWalkKeyframes(dir, anim.startFrame, anim.fps));
      } else if (anim.name.startsWith("harvest")) {
        keyframes.push(...getKnightHarvestKeyframes(anim.startFrame, anim.fps));
      } else if (anim.name.startsWith("mine")) {
        keyframes.push(...getKnightMineKeyframes(anim.startFrame, anim.fps));
      } else if (anim.name.startsWith("chop")) {
        keyframes.push(...getKnightChopKeyframes(anim.startFrame, anim.fps));
      } else if (anim.name.startsWith("attack")) {
        keyframes.push(...getKnightAttackKeyframes(anim.startFrame, anim.fps));
      } else if (anim.name.startsWith("skill")) {
        keyframes.push(...getKnightSkillKeyframes(anim.startFrame, anim.fps));
      } else if (anim.name.startsWith("interact")) {
        keyframes.push(...getKnightInteractKeyframes(anim.startFrame, anim.fps));
      }
    } else if (anim.name.startsWith("idle")) {
      for (let i = 0; i < anim.frameCount; i++) {
        const frameIndex = anim.startFrame + i;
        const breathY = (i === 1 || i === 2) ? -1 : 0;

        const bodyRuns: PixelRun[] = [
          { y: 8 + breathY, xStart: 12, xEnd: 19, color: skinBase },
          { y: 9 + breathY, xStart: 11, xEnd: 20, color: skinBase },
          { y: 10 + breathY, xStart: 11, xEnd: 20, color: skinBase },
          { y: 11 + breathY, xStart: 12, xEnd: 19, color: skinBase },
          { y: 12 + breathY, xStart: 13, xEnd: 18, color: skinBase },
          { y: 17 + breathY, xStart: 9, xEnd: 11, color: skinBase },
          { y: 18 + breathY, xStart: 9, xEnd: 11, color: skinBase },
          { y: 17 + breathY, xStart: 20, xEnd: 22, color: skinBase },
          { y: 18 + breathY, xStart: 20, xEnd: 22, color: skinBase }
        ];

        const clothRuns: PixelRun[] = [
          { y: 13 + breathY, xStart: 12, xEnd: 19, color: clothBase },
          { y: 14 + breathY, xStart: 11, xEnd: 20, color: clothBase },
          { y: 15 + breathY, xStart: 11, xEnd: 20, color: clothBase },
          { y: 16 + breathY, xStart: 12, xEnd: 19, color: clothBase },
          { y: 17 + breathY, xStart: 12, xEnd: 19, color: clothShadow },
          { y: 18, xStart: 12, xEnd: 19, color: clothBase },
          { y: 19, xStart: 12, xEnd: 19, color: clothBase },
          { y: 20, xStart: 12, xEnd: 19, color: clothBase },
          { y: 21, xStart: 12, xEnd: 19, color: clothBase },
          { y: 22, xStart: 12, xEnd: 19, color: clothShadow },
          { y: 23, xStart: 12, xEnd: 15, color: clothBase },
          { y: 23, xStart: 16, xEnd: 19, color: clothShadow },
          { y: 24, xStart: 12, xEnd: 15, color: clothBase },
          { y: 24, xStart: 16, xEnd: 19, color: clothShadow },
          { y: 25, xStart: 12, xEnd: 15, color: clothBase },
          { y: 25, xStart: 16, xEnd: 19, color: clothShadow },
          { y: 26, xStart: 11, xEnd: 15, color: outline },
          { y: 26, xStart: 16, xEnd: 20, color: outline },
          { y: 27, xStart: 11, xEnd: 15, color: outline },
          { y: 27, xStart: 16, xEnd: 20, color: outline }
        ];

        const hairRuns: PixelRun[] = [
          { y: 3 + breathY, xStart: 13, xEnd: 18, color: accent },
          { y: 4 + breathY, xStart: 12, xEnd: 19, color: accent },
          { y: 5 + breathY, xStart: 12, xEnd: 19, color: hairBase },
          { y: 6 + breathY, xStart: 8, xEnd: 23, color: accent },
          { y: 7 + breathY, xStart: 7, xEnd: 24, color: accent },
          { y: 8 + breathY, xStart: 10, xEnd: 12, color: hairBase },
          { y: 8 + breathY, xStart: 19, xEnd: 21, color: hairBase }
        ];

        keyframes.push({
          frameIndex,
          poseType: i % 2 === 0 ? "contact" : "passing",
          duration: 1.0 / anim.fps,
          cursorTarget: { x: 15, y: 14 + breathY },
          layerUpdates: [
            { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
            { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
            { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
          ]
        });
      }
    } else if (anim.name.startsWith("walk")) {
      const walkPoses: Array<{
        pose: "contact" | "down" | "passing" | "up";
        leftFootX: number;
        leftFootY: number;
        rightFootX: number;
        rightFootY: number;
        armShift: number;
        torsoBob: number;
      }> = [
        { pose: "contact", leftFootX: 10, leftFootY: 26, rightFootX: 17, rightFootY: 28, armShift: 1, torsoBob: 0 },
        { pose: "down", leftFootX: 11, leftFootY: 27, rightFootX: 17, rightFootY: 27, armShift: 0, torsoBob: 1 },
        { pose: "passing", leftFootX: 13, leftFootY: 27, rightFootX: 16, rightFootY: 25, armShift: -1, torsoBob: 0 },
        { pose: "contact", leftFootX: 17, leftFootY: 28, rightFootX: 10, rightFootY: 26, armShift: -1, torsoBob: 0 },
        { pose: "down", leftFootX: 17, leftFootY: 27, rightFootX: 11, rightFootY: 27, armShift: 0, torsoBob: 1 },
        { pose: "passing", leftFootX: 16, leftFootY: 25, rightFootX: 13, rightFootY: 27, armShift: 1, torsoBob: 0 }
      ];

      for (let i = 0; i < anim.frameCount; i++) {
        const frameIndex = anim.startFrame + i;
        const poseData = walkPoses[i % walkPoses.length];
        const bob = poseData.torsoBob;
        const arm = poseData.armShift;

        const bodyRuns: PixelRun[] = [
          { y: 8 + bob, xStart: 12, xEnd: 19, color: skinBase },
          { y: 9 + bob, xStart: 11, xEnd: 20, color: skinBase },
          { y: 10 + bob, xStart: 11, xEnd: 20, color: skinBase },
          { y: 11 + bob, xStart: 12, xEnd: 19, color: skinBase },
          { y: 12 + bob, xStart: 13, xEnd: 18, color: skinBase },
          { y: 17 + bob + arm, xStart: 8, xEnd: 10, color: skinBase },
          { y: 18 + bob + arm, xStart: 8, xEnd: 10, color: skinBase },
          { y: 17 + bob - arm, xStart: 21, xEnd: 23, color: skinBase },
          { y: 18 + bob - arm, xStart: 21, xEnd: 23, color: skinBase }
        ];

        const clothRuns: PixelRun[] = [
          { y: 13 + bob, xStart: 12, xEnd: 19, color: clothBase },
          { y: 14 + bob, xStart: 11, xEnd: 20, color: clothBase },
          { y: 15 + bob, xStart: 11, xEnd: 20, color: clothBase },
          { y: 16 + bob, xStart: 12, xEnd: 19, color: clothBase },
          { y: 17 + bob, xStart: 12, xEnd: 19, color: clothShadow },
          { y: 18 + bob, xStart: 12, xEnd: 19, color: clothBase },
          { y: 19 + bob, xStart: 12, xEnd: 19, color: clothBase },
          { y: 20 + bob, xStart: 12, xEnd: 19, color: clothBase },
          { y: 21 + bob, xStart: 12, xEnd: 19, color: clothBase },
          { y: 22 + bob, xStart: 12, xEnd: 19, color: clothShadow },
          { y: 23 + bob, xStart: poseData.leftFootX, xEnd: poseData.leftFootX + 4, color: clothBase },
          { y: 23 + bob, xStart: poseData.rightFootX, xEnd: poseData.rightFootX + 4, color: clothShadow },
          { y: 24 + bob, xStart: poseData.leftFootX, xEnd: poseData.leftFootX + 4, color: clothBase },
          { y: 24 + bob, xStart: poseData.rightFootX, xEnd: poseData.rightFootX + 4, color: clothShadow },
          { y: poseData.leftFootY, xStart: poseData.leftFootX, xEnd: poseData.leftFootX + 4, color: outline },
          { y: poseData.rightFootY, xStart: poseData.rightFootX, xEnd: poseData.rightFootX + 4, color: outline }
        ];

        const hairRuns: PixelRun[] = [
          { y: 3 + bob, xStart: 13, xEnd: 18, color: accent },
          { y: 4 + bob, xStart: 12, xEnd: 19, color: accent },
          { y: 5 + bob, xStart: 12, xEnd: 19, color: hairBase },
          { y: 6 + bob, xStart: 8, xEnd: 23, color: accent },
          { y: 7 + bob, xStart: 7, xEnd: 24, color: accent },
          { y: 8 + bob, xStart: 10, xEnd: 12, color: hairBase },
          { y: 8 + bob, xStart: 19, xEnd: 21, color: hairBase }
        ];

        keyframes.push({
          frameIndex,
          poseType: poseData.pose,
          duration: 1.0 / anim.fps,
          cursorTarget: { x: 15, y: 15 + bob },
          layerUpdates: [
            { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
            { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
            { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
          ]
        });
      }
    }

    plans.push({
      tag: anim.name,
      direction: anim.direction,
      startFrame: anim.startFrame,
      frameCount: anim.frameCount,
      fps: anim.fps,
      keyframes
    });
  }

  return plans;
}
