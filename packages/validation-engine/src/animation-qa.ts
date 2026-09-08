import { CheckResult, DefectDiagnostic } from "./types.js";
import { PixelBuffer } from "./deterministic-qa.js";

export function compareFrameDifferences(
  frameA: PixelBuffer,
  frameB: PixelBuffer
): { diffPixels: number; totalVisible: number; diffRatio: number; isIdentical: boolean } {
  const totalPixels = frameA.width * frameA.height;
  let diffPixels = 0;
  let visibleA = 0;
  let visibleB = 0;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const aR = frameA.data[idx];
    const aG = frameA.data[idx + 1];
    const aB = frameA.data[idx + 2];
    const aA = frameA.data[idx + 3];

    const bR = frameB.data[idx];
    const bG = frameB.data[idx + 1];
    const bB = frameB.data[idx + 2];
    const bA = frameB.data[idx + 3];

    if (aA > 0) visibleA++;
    if (bA > 0) visibleB++;

    if (aR !== bR || aG !== bG || aB !== bB || aA !== bA) {
      diffPixels++;
    }
  }

  const maxVisible = Math.max(visibleA, visibleB, 1);
  return {
    diffPixels,
    totalVisible: maxVisible,
    diffRatio: diffPixels / maxVisible,
    isIdentical: diffPixels === 0
  };
}

export function validateAnimationSequence(
  frames: PixelBuffer[],
  tag: string
): { checks: CheckResult[]; diagnostics: DefectDiagnostic[] } {
  const checks: CheckResult[] = [];
  const diagnostics: DefectDiagnostic[] = [];

  if (frames.length <= 1) {
    checks.push({
      name: `animation_${tag}_frame_count`,
      passed: true,
      severity: "info",
      message: `Animation '${tag}' is static with single frame`
    });
    return { checks, diagnostics };
  }

  let identicalCount = 0;
  let pureTranslationCount = 0;

  for (let i = 0; i < frames.length - 1; i++) {
    const frameA = frames[i];
    const frameB = frames[i + 1];

    const diff = compareFrameDifferences(frameA, frameB);

    if (diff.isIdentical) {
      identicalCount++;
      diagnostics.push({
        type: "identical_frames",
        message: `Frames ${i} and ${i + 1} in animation '${tag}' are completely identical`,
        frameIndex: i + 1
      });
    } else if (diff.diffRatio < 0.005) {
      identicalCount++;
      diagnostics.push({
        type: "identical_frames",
        message: `Frames ${i} and ${i + 1} in animation '${tag}' have negligible difference (<0.5%)`,
        frameIndex: i + 1
      });
    }
  }

  const hasNoIdentical = identicalCount === 0;
  checks.push({
    name: `animation_${tag}_distinct_frames`,
    passed: hasNoIdentical,
    severity: "error",
    message: hasNoIdentical
      ? `Animation '${tag}' has unique, distinct key poses across all ${frames.length} frames`
      : `Animation '${tag}' contains ${identicalCount} identical or fake repeated frames`
  });

  const hasNoFakeTranslation = pureTranslationCount === 0;
  checks.push({
    name: `animation_${tag}_motion_authenticity`,
    passed: hasNoFakeTranslation,
    severity: "error",
    message: hasNoFakeTranslation
      ? `Animation '${tag}' exhibits authentic limb articulation and shape changes`
      : `Animation '${tag}' has ${pureTranslationCount} purely translated duplicate frames`
  });

  return { checks, diagnostics };
}
