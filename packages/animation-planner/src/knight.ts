import { PixelRun, PixelTuple } from "@pixelorama/shared";
import { runsToPixelTuples } from "@pixelorama/pixel-art-planner";
import { AnimationKeyframe, LayerFrameDelta } from "./types.js";

const C = {
  outline: "#2b1c18",
  shadow: "#2b1c18",
  steelDark: "#3c4d5f",
  steelMid: "#687e96",
  steelLight: "#adc4db",
  steelWhite: "#f0f5fa",
  goldDark: "#875f1b",
  goldMid: "#d49b38",
  goldLight: "#fcd868",
  crimsonDark: "#611623",
  crimsonMid: "#b53245",
  crimsonLight: "#fa6475",
  tunicDark: "#213d29",
  tunicMid: "#3d6b49",
  leatherDark: "#452718",
  leatherMid: "#7a4932",
  skinBase: "#e8a987",
  skinShadow: "#c98263"
};

function mirrorRuns(runs: PixelRun[]): PixelRun[] {
  return runs.map((r) => ({
    y: r.y,
    xStart: 31 - r.xEnd,
    xEnd: 31 - r.xStart,
    color: r.color
  }));
}

export function getKnightIdleKeyframes(
  dir: "down" | "left" | "right" | "up",
  startFrame: number,
  fps: number
): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  for (let i = 0; i < 4; i++) {
    const frameIndex = startFrame + i;
    const bY = (i === 1 || i === 2) ? -1 : 0;
    const gleam = (i === 2);

    let bodyRuns: PixelRun[] = [];
    let clothRuns: PixelRun[] = [];
    let hairRuns: PixelRun[] = [];

    if (dir === "down") {
      bodyRuns = [
        { y: 16 + bY, xStart: 7, xEnd: 9, color: C.skinBase },
        { y: 16 + bY, xStart: 22, xEnd: 24, color: C.skinBase },
        { y: 17 + bY, xStart: 7, xEnd: 9, color: C.skinShadow },
        { y: 17 + bY, xStart: 22, xEnd: 24, color: C.skinShadow },
        { y: 21, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 21, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 22, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 22, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 23, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 23, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 24, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 24, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 25, xStart: 10, xEnd: 14, color: C.steelLight },
        { y: 25, xStart: 17, xEnd: 21, color: C.steelMid },
        { y: 26, xStart: 10, xEnd: 14, color: C.outline },
        { y: 26, xStart: 17, xEnd: 21, color: C.outline }
      ];

      clothRuns = [
        { y: 12 + bY, xStart: 7, xEnd: 10, color: C.goldLight },
        { y: 12 + bY, xStart: 11, xEnd: 20, color: C.steelLight },
        { y: 12 + bY, xStart: 21, xEnd: 24, color: C.goldMid },
        { y: 13 + bY, xStart: 7, xEnd: 10, color: C.steelLight },
        { y: 13 + bY, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 13 + bY, xStart: 15, xEnd: 16, color: gleam ? C.steelWhite : C.goldLight },
        { y: 13 + bY, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 13 + bY, xStart: 21, xEnd: 24, color: C.steelMid },
        { y: 14 + bY, xStart: 7, xEnd: 10, color: C.steelMid },
        { y: 14 + bY, xStart: 11, xEnd: 12, color: C.steelLight },
        { y: 14 + bY, xStart: 13, xEnd: 18, color: gleam ? C.steelWhite : C.goldLight },
        { y: 14 + bY, xStart: 19, xEnd: 20, color: C.steelDark },
        { y: 14 + bY, xStart: 21, xEnd: 24, color: C.steelDark },
        { y: 15 + bY, xStart: 5, xEnd: 8, color: C.goldMid },
        { y: 15 + bY, xStart: 9, xEnd: 10, color: C.outline },
        { y: 15 + bY, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 15 + bY, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 15 + bY, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 15 + bY, xStart: 21, xEnd: 23, color: C.outline },
        { y: 16 + bY, xStart: 5, xEnd: 5, color: C.goldMid },
        { y: 16 + bY, xStart: 6, xEnd: 7, color: C.crimsonMid },
        { y: 16 + bY, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 16 + bY, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 16 + bY, xStart: 15, xEnd: 16, color: C.steelMid },
        { y: 16 + bY, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 16 + bY, xStart: 23, xEnd: 24, color: C.goldLight },
        { y: 17 + bY, xStart: 5, xEnd: 5, color: C.goldMid },
        { y: 17 + bY, xStart: 6, xEnd: 7, color: C.crimsonMid },
        { y: 17 + bY, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 17 + bY, xStart: 11, xEnd: 14, color: C.leatherMid },
        { y: 17 + bY, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 17 + bY, xStart: 17, xEnd: 20, color: C.leatherDark },
        { y: 17 + bY, xStart: 23, xEnd: 24, color: C.leatherDark },
        { y: 18 + bY, xStart: 5, xEnd: 5, color: C.goldMid },
        { y: 18 + bY, xStart: 6, xEnd: 7, color: C.crimsonMid },
        { y: 18 + bY, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 18 + bY, xStart: 11, xEnd: 20, color: C.tunicMid },
        { y: 18 + bY, xStart: 23, xEnd: 24, color: C.leatherDark },
        { y: 19, xStart: 6, xEnd: 7, color: C.crimsonDark },
        { y: 19, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 19, xStart: 10, xEnd: 21, color: C.tunicDark },
        { y: 19, xStart: 23, xEnd: 24, color: C.goldMid },
        { y: 20, xStart: 6, xEnd: 7, color: C.outline },
        { y: 20, xStart: 11, xEnd: 20, color: C.outline }
      ];

      hairRuns = [
        { y: 1 + bY, xStart: 15, xEnd: 17, color: C.crimsonLight },
        { y: 2 + bY, xStart: 14, xEnd: 18, color: C.crimsonLight },
        { y: 3 + bY, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 4 + bY, xStart: 12, xEnd: 19, color: C.steelLight },
        { y: 5 + bY, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 5 + bY, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 5 + bY, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 5 + bY, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 6 + bY, xStart: 10, xEnd: 11, color: C.steelLight },
        { y: 6 + bY, xStart: 12, xEnd: 14, color: C.steelWhite },
        { y: 6 + bY, xStart: 15, xEnd: 18, color: C.steelMid },
        { y: 6 + bY, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 7 + bY, xStart: 10, xEnd: 12, color: C.goldMid },
        { y: 7 + bY, xStart: 13, xEnd: 16, color: C.goldLight },
        { y: 7 + bY, xStart: 17, xEnd: 21, color: C.goldDark },
        { y: 8 + bY, xStart: 10, xEnd: 12, color: C.outline },
        { y: 8 + bY, xStart: 13, xEnd: 13, color: C.steelWhite },
        { y: 8 + bY, xStart: 14, xEnd: 17, color: C.outline },
        { y: 8 + bY, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 8 + bY, xStart: 19, xEnd: 21, color: C.outline },
        { y: 9 + bY, xStart: 10, xEnd: 12, color: C.outline },
        { y: 9 + bY, xStart: 13, xEnd: 13, color: C.steelWhite },
        { y: 9 + bY, xStart: 14, xEnd: 17, color: C.outline },
        { y: 9 + bY, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 9 + bY, xStart: 19, xEnd: 21, color: C.outline },
        { y: 10 + bY, xStart: 11, xEnd: 15, color: C.steelMid },
        { y: 10 + bY, xStart: 16, xEnd: 20, color: C.steelDark },
        { y: 11 + bY, xStart: 12, xEnd: 19, color: C.outline }
      ];
    } else if (dir === "up") {
      bodyRuns = [
        { y: 21, xStart: 11, xEnd: 14, color: C.steelDark },
        { y: 21, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 22, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 22, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 23, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 23, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 24, xStart: 11, xEnd: 14, color: C.steelDark },
        { y: 24, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 25, xStart: 10, xEnd: 14, color: C.steelMid },
        { y: 25, xStart: 17, xEnd: 21, color: C.steelDark },
        { y: 26, xStart: 10, xEnd: 14, color: C.outline },
        { y: 26, xStart: 17, xEnd: 21, color: C.outline }
      ];

      clothRuns = [
        { y: 12 + bY, xStart: 7, xEnd: 9, color: C.steelMid },
        { y: 12 + bY, xStart: 10, xEnd: 21, color: C.crimsonMid },
        { y: 12 + bY, xStart: 22, xEnd: 24, color: C.steelDark },
        { y: 13 + bY, xStart: 7, xEnd: 9, color: C.steelMid },
        { y: 13 + bY, xStart: 10, xEnd: 21, color: C.crimsonMid },
        { y: 13 + bY, xStart: 22, xEnd: 24, color: C.steelDark },
        { y: 14 + bY, xStart: 7, xEnd: 9, color: C.outline },
        { y: 14 + bY, xStart: 9, xEnd: 13, color: gleam ? C.crimsonLight : C.crimsonMid },
        { y: 14 + bY, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 14 + bY, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 14 + bY, xStart: 22, xEnd: 24, color: C.outline },
        { y: 15 + bY, xStart: 9, xEnd: 13, color: gleam ? C.crimsonLight : C.crimsonMid },
        { y: 15 + bY, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 15 + bY, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 16 + bY, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 16 + bY, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 16 + bY, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 17 + bY, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 17 + bY, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 17 + bY, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 18 + bY, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 18 + bY, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 18 + bY, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 19, xStart: 9, xEnd: 22, color: C.crimsonMid },
        { y: 20, xStart: 8, xEnd: 23, color: C.crimsonDark },
        { y: 21, xStart: 8, xEnd: 23, color: C.outline }
      ];

      hairRuns = [
        { y: 1 + bY, xStart: 15, xEnd: 17, color: C.crimsonLight },
        { y: 2 + bY, xStart: 14, xEnd: 18, color: C.crimsonLight },
        { y: 3 + bY, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 4 + bY, xStart: 12, xEnd: 14, color: C.steelWhite },
        { y: 4 + bY, xStart: 15, xEnd: 19, color: C.steelMid },
        { y: 5 + bY, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 5 + bY, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 5 + bY, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 5 + bY, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 6 + bY, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 6 + bY, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 6 + bY, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 6 + bY, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 7 + bY, xStart: 10, xEnd: 15, color: C.steelLight },
        { y: 7 + bY, xStart: 16, xEnd: 21, color: C.steelMid },
        { y: 8 + bY, xStart: 10, xEnd: 15, color: C.steelMid },
        { y: 8 + bY, xStart: 16, xEnd: 21, color: C.steelDark },
        { y: 9 + bY, xStart: 10, xEnd: 15, color: C.steelMid },
        { y: 9 + bY, xStart: 16, xEnd: 21, color: C.steelDark },
        { y: 10 + bY, xStart: 11, xEnd: 15, color: C.goldMid },
        { y: 10 + bY, xStart: 16, xEnd: 20, color: C.goldDark },
        { y: 11 + bY, xStart: 11, xEnd: 20, color: C.outline }
      ];
    } else {
      const rightBodyRuns: PixelRun[] = [
        { y: 21, xStart: 14, xEnd: 17, color: C.steelLight },
        { y: 21, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 22, xStart: 14, xEnd: 17, color: C.steelLight },
        { y: 22, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 23, xStart: 14, xEnd: 17, color: C.steelMid },
        { y: 23, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 24, xStart: 14, xEnd: 17, color: C.steelMid },
        { y: 24, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 25, xStart: 14, xEnd: 18, color: C.steelLight },
        { y: 25, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 26, xStart: 14, xEnd: 18, color: C.outline },
        { y: 26, xStart: 10, xEnd: 13, color: C.outline }
      ];

      const rightClothRuns: PixelRun[] = [
        { y: 12 + bY, xStart: 11, xEnd: 16, color: C.steelLight },
        { y: 12 + bY, xStart: 12, xEnd: 15, color: C.goldMid },
        { y: 13 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 13 + bY, xStart: 11, xEnd: 17, color: C.steelLight },
        { y: 14 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 14 + bY, xStart: 11, xEnd: 17, color: C.steelMid },
        { y: 14 + bY, xStart: 18, xEnd: 21, color: C.goldMid },
        { y: 15 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 15 + bY, xStart: 11, xEnd: 17, color: C.steelMid },
        { y: 15 + bY, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 15 + bY, xStart: 19, xEnd: 20, color: gleam ? C.crimsonLight : C.crimsonMid },
        { y: 15 + bY, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 16 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 16 + bY, xStart: 11, xEnd: 16, color: C.steelDark },
        { y: 16 + bY, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 16 + bY, xStart: 19, xEnd: 20, color: C.crimsonMid },
        { y: 16 + bY, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 17 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 17 + bY, xStart: 11, xEnd: 16, color: C.leatherMid },
        { y: 17 + bY, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 17 + bY, xStart: 19, xEnd: 20, color: C.crimsonMid },
        { y: 17 + bY, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 18 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 18 + bY, xStart: 10, xEnd: 17, color: C.tunicMid },
        { y: 18 + bY, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 18 + bY, xStart: 19, xEnd: 20, color: C.crimsonMid },
        { y: 18 + bY, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 19, xStart: 7, xEnd: 10, color: C.crimsonDark },
        { y: 19, xStart: 10, xEnd: 17, color: C.tunicDark },
        { y: 19, xStart: 19, xEnd: 20, color: C.crimsonDark },
        { y: 20, xStart: 7, xEnd: 10, color: C.outline },
        { y: 20, xStart: 10, xEnd: 17, color: C.outline },
        { y: 20, xStart: 19, xEnd: 20, color: C.outline }
      ];

      const rightHairRuns: PixelRun[] = [
        { y: 2 + bY, xStart: 11, xEnd: 15, color: C.crimsonLight },
        { y: 3 + bY, xStart: 9, xEnd: 15, color: C.crimsonLight },
        { y: 4 + bY, xStart: 8, xEnd: 13, color: C.crimsonMid },
        { y: 4 + bY, xStart: 11, xEnd: 17, color: C.steelLight },
        { y: 5 + bY, xStart: 8, xEnd: 11, color: C.crimsonDark },
        { y: 5 + bY, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 5 + bY, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 5 + bY, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 6 + bY, xStart: 9, xEnd: 11, color: C.steelLight },
        { y: 6 + bY, xStart: 12, xEnd: 15, color: C.steelWhite },
        { y: 6 + bY, xStart: 16, xEnd: 19, color: C.steelMid },
        { y: 7 + bY, xStart: 9, xEnd: 12, color: C.goldMid },
        { y: 7 + bY, xStart: 13, xEnd: 17, color: C.goldLight },
        { y: 7 + bY, xStart: 18, xEnd: 20, color: C.goldMid },
        { y: 8 + bY, xStart: 9, xEnd: 16, color: C.steelMid },
        { y: 8 + bY, xStart: 17, xEnd: 20, color: C.outline },
        { y: 8 + bY, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 8 + bY, xStart: 21, xEnd: 21, color: C.outline },
        { y: 9 + bY, xStart: 10, xEnd: 16, color: C.steelDark },
        { y: 9 + bY, xStart: 17, xEnd: 21, color: C.outline },
        { y: 9 + bY, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 10 + bY, xStart: 10, xEnd: 18, color: C.steelMid },
        { y: 10 + bY, xStart: 19, xEnd: 20, color: C.outline },
        { y: 11 + bY, xStart: 11, xEnd: 18, color: C.outline }
      ];

      if (dir === "right") {
        bodyRuns = rightBodyRuns;
        clothRuns = rightClothRuns;
        hairRuns = rightHairRuns;
      } else {
        bodyRuns = mirrorRuns(rightBodyRuns);
        clothRuns = mirrorRuns(rightClothRuns);
        hairRuns = mirrorRuns(rightHairRuns);
      }
    }

    const layerUpdates: LayerFrameDelta[] = [
      { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
      { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
      { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
    ];

    keyframes.push({
      frameIndex,
      poseType: i % 2 === 0 ? "contact" : "passing",
      duration: 1.0 / fps,
      cursorTarget: { x: 15, y: 14 + bY },
      layerUpdates
    });
  }

  return keyframes;
}

export function getKnightWalkKeyframes(
  dir: "down" | "left" | "right" | "up",
  startFrame: number,
  fps: number
): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  const walkSteps = [
    { pose: "contact" as const, bob: 0, step: -1 },
    { pose: "down" as const, bob: 1, step: -1 },
    { pose: "passing" as const, bob: 0, step: 0 },
    { pose: "contact" as const, bob: 0, step: 1 },
    { pose: "down" as const, bob: 1, step: 1 },
    { pose: "passing" as const, bob: 0, step: 0 }
  ];

  for (let i = 0; i < 6; i++) {
    const frameIndex = startFrame + i;
    const { pose, bob, step } = walkSteps[i];

    let bodyRuns: PixelRun[] = [];
    let clothRuns: PixelRun[] = [];
    let hairRuns: PixelRun[] = [];

    if (dir === "down") {
      const leftFootShift = step < 0 ? 1 : step > 0 ? -1 : 0;
      const rightFootShift = step > 0 ? 1 : step < 0 ? -1 : 0;

      bodyRuns = [
        { y: 16 + bob, xStart: 7, xEnd: 9, color: C.skinBase },
        { y: 16 + bob, xStart: 22, xEnd: 24, color: C.skinBase },
        { y: 17 + bob, xStart: 7, xEnd: 9, color: C.skinShadow },
        { y: 17 + bob, xStart: 22, xEnd: 24, color: C.skinShadow },
        { y: 21 + bob, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 21 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 22 + bob, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 22 + bob, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 23 + bob, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 23 + bob, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 24 + bob, xStart: 11 + leftFootShift, xEnd: 14 + leftFootShift, color: C.steelMid },
        { y: 24 + bob, xStart: 17 + rightFootShift, xEnd: 20 + rightFootShift, color: C.steelDark },
        { y: 25, xStart: 10 + leftFootShift, xEnd: 14 + leftFootShift, color: C.steelLight },
        { y: 25, xStart: 17 + rightFootShift, xEnd: 21 + rightFootShift, color: C.steelMid },
        { y: 26, xStart: 10 + leftFootShift, xEnd: 14 + leftFootShift, color: C.outline },
        { y: 26, xStart: 17 + rightFootShift, xEnd: 21 + rightFootShift, color: C.outline }
      ];

      clothRuns = [
        { y: 12 + bob, xStart: 7, xEnd: 10, color: C.goldLight },
        { y: 12 + bob, xStart: 11, xEnd: 20, color: C.steelLight },
        { y: 12 + bob, xStart: 21, xEnd: 24, color: C.goldMid },
        { y: 13 + bob, xStart: 7, xEnd: 10, color: C.steelLight },
        { y: 13 + bob, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 13 + bob, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 13 + bob, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 13 + bob, xStart: 21, xEnd: 24, color: C.steelMid },
        { y: 14 + bob, xStart: 7, xEnd: 10, color: C.steelMid },
        { y: 14 + bob, xStart: 11, xEnd: 12, color: C.steelLight },
        { y: 14 + bob, xStart: 13, xEnd: 18, color: C.goldLight },
        { y: 14 + bob, xStart: 19, xEnd: 20, color: C.steelDark },
        { y: 14 + bob, xStart: 21, xEnd: 24, color: C.steelDark },
        { y: 15 + bob, xStart: 5, xEnd: 8, color: C.goldMid },
        { y: 15 + bob, xStart: 9, xEnd: 10, color: C.outline },
        { y: 15 + bob, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 15 + bob, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 15 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 15 + bob, xStart: 21, xEnd: 23, color: C.outline },
        { y: 16 + bob, xStart: 5, xEnd: 5, color: C.goldMid },
        { y: 16 + bob, xStart: 6, xEnd: 7, color: C.crimsonMid },
        { y: 16 + bob, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 16 + bob, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 16 + bob, xStart: 15, xEnd: 16, color: C.steelMid },
        { y: 16 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 16 + bob, xStart: 23, xEnd: 24, color: C.goldLight },
        { y: 17 + bob, xStart: 5, xEnd: 5, color: C.goldMid },
        { y: 17 + bob, xStart: 6, xEnd: 7, color: C.crimsonMid },
        { y: 17 + bob, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 17 + bob, xStart: 11, xEnd: 14, color: C.leatherMid },
        { y: 17 + bob, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 17 + bob, xStart: 17, xEnd: 20, color: C.leatherDark },
        { y: 17 + bob, xStart: 23, xEnd: 24, color: C.leatherDark },
        { y: 18 + bob, xStart: 5, xEnd: 5, color: C.goldMid },
        { y: 18 + bob, xStart: 6, xEnd: 7, color: C.crimsonMid },
        { y: 18 + bob, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 18 + bob, xStart: 11, xEnd: 20, color: C.tunicMid },
        { y: 18 + bob, xStart: 23, xEnd: 24, color: C.leatherDark },
        { y: 19 + bob, xStart: 6, xEnd: 7, color: C.crimsonDark },
        { y: 19 + bob, xStart: 8, xEnd: 8, color: C.goldMid },
        { y: 19 + bob, xStart: 10, xEnd: 21, color: C.tunicDark },
        { y: 19 + bob, xStart: 23, xEnd: 24, color: C.goldMid },
        { y: 20 + bob, xStart: 6, xEnd: 7, color: C.outline },
        { y: 20 + bob, xStart: 11, xEnd: 20, color: C.outline }
      ];

      hairRuns = [
        { y: 1 + bob, xStart: 15, xEnd: 17, color: C.crimsonLight },
        { y: 2 + bob, xStart: 14, xEnd: 18, color: C.crimsonLight },
        { y: 3 + bob, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 4 + bob, xStart: 12, xEnd: 19, color: C.steelLight },
        { y: 5 + bob, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 5 + bob, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 5 + bob, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 5 + bob, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 6 + bob, xStart: 10, xEnd: 11, color: C.steelLight },
        { y: 6 + bob, xStart: 12, xEnd: 14, color: C.steelWhite },
        { y: 6 + bob, xStart: 15, xEnd: 18, color: C.steelMid },
        { y: 6 + bob, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 7 + bob, xStart: 10, xEnd: 12, color: C.goldMid },
        { y: 7 + bob, xStart: 13, xEnd: 16, color: C.goldLight },
        { y: 7 + bob, xStart: 17, xEnd: 21, color: C.goldDark },
        { y: 8 + bob, xStart: 10, xEnd: 12, color: C.outline },
        { y: 8 + bob, xStart: 13, xEnd: 13, color: C.steelWhite },
        { y: 8 + bob, xStart: 14, xEnd: 17, color: C.outline },
        { y: 8 + bob, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 8 + bob, xStart: 19, xEnd: 21, color: C.outline },
        { y: 9 + bob, xStart: 10, xEnd: 12, color: C.outline },
        { y: 9 + bob, xStart: 13, xEnd: 13, color: C.steelWhite },
        { y: 9 + bob, xStart: 14, xEnd: 17, color: C.outline },
        { y: 9 + bob, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 9 + bob, xStart: 19, xEnd: 21, color: C.outline },
        { y: 10 + bob, xStart: 11, xEnd: 15, color: C.steelMid },
        { y: 10 + bob, xStart: 16, xEnd: 20, color: C.steelDark },
        { y: 11 + bob, xStart: 12, xEnd: 19, color: C.outline }
      ];
    } else if (dir === "up") {
      const leftShift = step < 0 ? 1 : step > 0 ? -1 : 0;
      const rightShift = step > 0 ? 1 : step < 0 ? -1 : 0;

      bodyRuns = [
        { y: 21 + bob, xStart: 11, xEnd: 14, color: C.steelDark },
        { y: 21 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 22 + bob, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 22 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 23 + bob, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 23 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 24 + bob, xStart: 11 + leftShift, xEnd: 14 + leftShift, color: C.steelDark },
        { y: 24 + bob, xStart: 17 + rightShift, xEnd: 20 + rightShift, color: C.steelDark },
        { y: 25, xStart: 10 + leftShift, xEnd: 14 + leftShift, color: C.steelMid },
        { y: 25, xStart: 17 + rightShift, xEnd: 21 + rightShift, color: C.steelDark },
        { y: 26, xStart: 10 + leftShift, xEnd: 14 + leftShift, color: C.outline },
        { y: 26, xStart: 17 + rightShift, xEnd: 21 + rightShift, color: C.outline }
      ];

      clothRuns = [
        { y: 12 + bob, xStart: 7, xEnd: 9, color: C.steelMid },
        { y: 12 + bob, xStart: 10, xEnd: 21, color: C.crimsonMid },
        { y: 12 + bob, xStart: 22, xEnd: 24, color: C.steelDark },
        { y: 13 + bob, xStart: 7, xEnd: 9, color: C.steelMid },
        { y: 13 + bob, xStart: 10, xEnd: 21, color: C.crimsonMid },
        { y: 13 + bob, xStart: 22, xEnd: 24, color: C.steelDark },
        { y: 14 + bob, xStart: 7, xEnd: 9, color: C.outline },
        { y: 14 + bob, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 14 + bob, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 14 + bob, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 14 + bob, xStart: 22, xEnd: 24, color: C.outline },
        { y: 15 + bob, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 15 + bob, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 15 + bob, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 16 + bob, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 16 + bob, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 16 + bob, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 17 + bob, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 17 + bob, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 17 + bob, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 18 + bob, xStart: 9, xEnd: 13, color: C.crimsonMid },
        { y: 18 + bob, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 18 + bob, xStart: 19, xEnd: 22, color: C.crimsonDark },
        { y: 19 + bob, xStart: 9, xEnd: 22, color: C.crimsonMid },
        { y: 20 + bob, xStart: 8, xEnd: 23, color: C.crimsonDark },
        { y: 21 + bob, xStart: 8, xEnd: 23, color: C.outline }
      ];

      hairRuns = [
        { y: 1 + bob, xStart: 15, xEnd: 17, color: C.crimsonLight },
        { y: 2 + bob, xStart: 14, xEnd: 18, color: C.crimsonLight },
        { y: 3 + bob, xStart: 14, xEnd: 18, color: C.crimsonMid },
        { y: 4 + bob, xStart: 12, xEnd: 14, color: C.steelWhite },
        { y: 4 + bob, xStart: 15, xEnd: 19, color: C.steelMid },
        { y: 5 + bob, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 5 + bob, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 5 + bob, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 5 + bob, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 6 + bob, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 6 + bob, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 6 + bob, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 6 + bob, xStart: 19, xEnd: 21, color: C.steelDark },
        { y: 7 + bob, xStart: 10, xEnd: 15, color: C.steelLight },
        { y: 7 + bob, xStart: 16, xEnd: 21, color: C.steelMid },
        { y: 8 + bob, xStart: 10, xEnd: 15, color: C.steelMid },
        { y: 8 + bob, xStart: 16, xEnd: 21, color: C.steelDark },
        { y: 9 + bob, xStart: 10, xEnd: 15, color: C.steelMid },
        { y: 9 + bob, xStart: 16, xEnd: 21, color: C.steelDark },
        { y: 10 + bob, xStart: 11, xEnd: 15, color: C.goldMid },
        { y: 10 + bob, xStart: 16, xEnd: 20, color: C.goldDark },
        { y: 11 + bob, xStart: 11, xEnd: 20, color: C.outline }
      ];
    } else {
      const stepShift = step * 2;
      const rightBodyRuns: PixelRun[] = [
        { y: 21 + bob, xStart: 14 + stepShift, xEnd: 17 + stepShift, color: C.steelLight },
        { y: 21 + bob, xStart: 10 - stepShift, xEnd: 13 - stepShift, color: C.steelDark },
        { y: 22 + bob, xStart: 14 + stepShift, xEnd: 17 + stepShift, color: C.steelLight },
        { y: 22 + bob, xStart: 10 - stepShift, xEnd: 13 - stepShift, color: C.steelDark },
        { y: 23 + bob, xStart: 14 + stepShift, xEnd: 17 + stepShift, color: C.steelMid },
        { y: 23 + bob, xStart: 10 - stepShift, xEnd: 13 - stepShift, color: C.steelDark },
        { y: 24 + bob, xStart: 14 + stepShift, xEnd: 17 + stepShift, color: C.steelMid },
        { y: 24 + bob, xStart: 10 - stepShift, xEnd: 13 - stepShift, color: C.steelDark },
        { y: 25, xStart: 14 + stepShift, xEnd: 18 + stepShift, color: C.steelLight },
        { y: 25, xStart: 10 - stepShift, xEnd: 13 - stepShift, color: C.steelDark },
        { y: 26, xStart: 14 + stepShift, xEnd: 18 + stepShift, color: C.outline },
        { y: 26, xStart: 10 - stepShift, xEnd: 13 - stepShift, color: C.outline }
      ];

      const rightClothRuns: PixelRun[] = [
        { y: 12 + bob, xStart: 11, xEnd: 16, color: C.steelLight },
        { y: 12 + bob, xStart: 12, xEnd: 15, color: C.goldMid },
        { y: 13 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 13 + bob, xStart: 11, xEnd: 17, color: C.steelLight },
        { y: 14 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 14 + bob, xStart: 11, xEnd: 17, color: C.steelMid },
        { y: 14 + bob, xStart: 18, xEnd: 21, color: C.goldMid },
        { y: 15 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 15 + bob, xStart: 11, xEnd: 17, color: C.steelMid },
        { y: 15 + bob, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 15 + bob, xStart: 19, xEnd: 20, color: C.crimsonMid },
        { y: 15 + bob, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 16 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 16 + bob, xStart: 11, xEnd: 16, color: C.steelDark },
        { y: 16 + bob, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 16 + bob, xStart: 19, xEnd: 20, color: C.crimsonMid },
        { y: 16 + bob, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 17 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 17 + bob, xStart: 11, xEnd: 16, color: C.leatherMid },
        { y: 17 + bob, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 17 + bob, xStart: 19, xEnd: 20, color: C.crimsonMid },
        { y: 17 + bob, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 18 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 18 + bob, xStart: 10, xEnd: 17, color: C.tunicMid },
        { y: 18 + bob, xStart: 18, xEnd: 18, color: C.goldMid },
        { y: 18 + bob, xStart: 19, xEnd: 20, color: C.crimsonMid },
        { y: 18 + bob, xStart: 21, xEnd: 21, color: C.goldMid },
        { y: 19 + bob, xStart: 7, xEnd: 10, color: C.crimsonDark },
        { y: 19 + bob, xStart: 10, xEnd: 17, color: C.tunicDark },
        { y: 19 + bob, xStart: 19, xEnd: 20, color: C.crimsonDark },
        { y: 20 + bob, xStart: 7, xEnd: 10, color: C.outline },
        { y: 20 + bob, xStart: 10, xEnd: 17, color: C.outline },
        { y: 20 + bob, xStart: 19, xEnd: 20, color: C.outline }
      ];

      const rightHairRuns: PixelRun[] = [
        { y: 2 + bob, xStart: 11, xEnd: 15, color: C.crimsonLight },
        { y: 3 + bob, xStart: 9, xEnd: 15, color: C.crimsonLight },
        { y: 4 + bob, xStart: 8, xEnd: 13, color: C.crimsonMid },
        { y: 4 + bob, xStart: 11, xEnd: 17, color: C.steelLight },
        { y: 5 + bob, xStart: 8, xEnd: 11, color: C.crimsonDark },
        { y: 5 + bob, xStart: 10, xEnd: 12, color: C.steelLight },
        { y: 5 + bob, xStart: 13, xEnd: 15, color: C.steelWhite },
        { y: 5 + bob, xStart: 16, xEnd: 18, color: C.steelMid },
        { y: 6 + bob, xStart: 9, xEnd: 11, color: C.steelLight },
        { y: 6 + bob, xStart: 12, xEnd: 15, color: C.steelWhite },
        { y: 6 + bob, xStart: 16, xEnd: 19, color: C.steelMid },
        { y: 7 + bob, xStart: 9, xEnd: 12, color: C.goldMid },
        { y: 7 + bob, xStart: 13, xEnd: 17, color: C.goldLight },
        { y: 7 + bob, xStart: 18, xEnd: 20, color: C.goldMid },
        { y: 8 + bob, xStart: 9, xEnd: 16, color: C.steelMid },
        { y: 8 + bob, xStart: 17, xEnd: 20, color: C.outline },
        { y: 8 + bob, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 8 + bob, xStart: 21, xEnd: 21, color: C.outline },
        { y: 9 + bob, xStart: 10, xEnd: 16, color: C.steelDark },
        { y: 9 + bob, xStart: 17, xEnd: 21, color: C.outline },
        { y: 9 + bob, xStart: 18, xEnd: 18, color: C.steelWhite },
        { y: 10 + bob, xStart: 10, xEnd: 18, color: C.steelMid },
        { y: 10 + bob, xStart: 19, xEnd: 20, color: C.outline },
        { y: 11 + bob, xStart: 11, xEnd: 18, color: C.outline }
      ];

      if (dir === "right") {
        bodyRuns = rightBodyRuns;
        clothRuns = rightClothRuns;
        hairRuns = rightHairRuns;
      } else {
        bodyRuns = mirrorRuns(rightBodyRuns);
        clothRuns = mirrorRuns(rightClothRuns);
        hairRuns = mirrorRuns(rightHairRuns);
      }
    }

    const layerUpdates: LayerFrameDelta[] = [
      { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
      { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
      { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
    ];

    keyframes.push({
      frameIndex,
      poseType: pose,
      duration: 1.0 / fps,
      cursorTarget: { x: 15, y: 15 + bob },
      layerUpdates
    });
  }

  return keyframes;
}
