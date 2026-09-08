import { PixelRun } from "@pixelorama/shared";
import { runsToPixelTuples } from "@pixelorama/pixel-art-planner";
import { AnimationKeyframe, LayerFrameDelta } from "./types.js";

const C = {
  outline: "#251c1c",
  shadow: "#251c1c",
  steelDark: "#3e4e60",
  steelMid: "#687e96",
  steelLight: "#adc4db",
  steelWhite: "#f2f6fa",
  goldDark: "#7e5210",
  goldMid: "#c98d24",
  goldLight: "#fae06b",
  crimsonDark: "#561320",
  crimsonMid: "#aa2c41",
  crimsonLight: "#f05d73",
  tunicDark: "#1e3825",
  tunicMid: "#386644",
  leatherDark: "#3d2114",
  leatherMid: "#6e3f29",
  skinBase: "#e8a987",
  skinShadow: "#c98263",
  vfxYellow: "#ffff66",
  vfxWhite: "#ffffff",
  vfxCyan: "#66eeff",
  vfxOrange: "#ff9933",
  woodDark: "#4d2600",
  woodMid: "#8b5a2b",
  woodLight: "#c89650",
  cropGold: "#ffcc00",
  cropLeaf: "#44bb44",
  oreGrey: "#667788",
  oreGem: "#00ddff"
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
        { y: 15 + bY, xStart: 7, xEnd: 9, color: C.skinBase },
        { y: 15 + bY, xStart: 22, xEnd: 24, color: C.skinBase },
        { y: 16 + bY, xStart: 7, xEnd: 9, color: C.skinBase },
        { y: 16 + bY, xStart: 22, xEnd: 24, color: C.skinBase },
        { y: 17 + bY, xStart: 7, xEnd: 9, color: C.skinShadow },
        { y: 17 + bY, xStart: 22, xEnd: 24, color: C.skinShadow },
        { y: 20, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 20, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 21, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 21, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 22, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 22, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 23, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 23, xStart: 17, xEnd: 20, color: C.steelDark },
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
        { y: 13 + bY, xStart: 6, xEnd: 10, color: C.steelLight },
        { y: 13 + bY, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 13 + bY, xStart: 15, xEnd: 16, color: gleam ? C.steelWhite : C.goldLight },
        { y: 13 + bY, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 13 + bY, xStart: 21, xEnd: 25, color: C.steelMid },
        { y: 14 + bY, xStart: 6, xEnd: 10, color: C.steelMid },
        { y: 14 + bY, xStart: 11, xEnd: 12, color: C.steelLight },
        { y: 14 + bY, xStart: 13, xEnd: 18, color: gleam ? C.steelWhite : C.goldLight },
        { y: 14 + bY, xStart: 19, xEnd: 20, color: C.steelDark },
        { y: 14 + bY, xStart: 21, xEnd: 25, color: C.steelDark },
        { y: 15 + bY, xStart: 6, xEnd: 9, color: C.goldMid },
        { y: 15 + bY, xStart: 10, xEnd: 14, color: C.steelLight },
        { y: 15 + bY, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 15 + bY, xStart: 17, xEnd: 21, color: C.steelDark },
        { y: 15 + bY, xStart: 22, xEnd: 25, color: C.goldDark },
        { y: 16 + bY, xStart: 6, xEnd: 6, color: C.goldMid },
        { y: 16 + bY, xStart: 7, xEnd: 8, color: C.crimsonMid },
        { y: 16 + bY, xStart: 9, xEnd: 9, color: C.goldMid },
        { y: 16 + bY, xStart: 10, xEnd: 14, color: C.steelMid },
        { y: 16 + bY, xStart: 15, xEnd: 16, color: C.steelLight },
        { y: 16 + bY, xStart: 17, xEnd: 21, color: C.steelDark },
        { y: 16 + bY, xStart: 22, xEnd: 23, color: C.leatherMid },
        { y: 16 + bY, xStart: 24, xEnd: 24, color: C.goldLight },
        { y: 17 + bY, xStart: 6, xEnd: 6, color: C.goldMid },
        { y: 17 + bY, xStart: 7, xEnd: 8, color: C.crimsonMid },
        { y: 17 + bY, xStart: 9, xEnd: 9, color: C.goldMid },
        { y: 17 + bY, xStart: 10, xEnd: 14, color: C.leatherMid },
        { y: 17 + bY, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 17 + bY, xStart: 17, xEnd: 21, color: C.leatherDark },
        { y: 17 + bY, xStart: 22, xEnd: 23, color: C.leatherDark },
        { y: 17 + bY, xStart: 24, xEnd: 24, color: C.goldMid },
        { y: 18 + bY, xStart: 6, xEnd: 6, color: C.goldMid },
        { y: 18 + bY, xStart: 7, xEnd: 8, color: C.crimsonDark },
        { y: 18 + bY, xStart: 9, xEnd: 9, color: C.goldMid },
        { y: 18 + bY, xStart: 10, xEnd: 21, color: C.tunicMid },
        { y: 18 + bY, xStart: 23, xEnd: 24, color: C.steelLight },
        { y: 19 + bY, xStart: 7, xEnd: 8, color: C.crimsonDark },
        { y: 19 + bY, xStart: 9, xEnd: 22, color: C.tunicDark },
        { y: 19 + bY, xStart: 23, xEnd: 24, color: C.steelMid },
        { y: 20 + bY, xStart: 8, xEnd: 8, color: C.outline },
        { y: 20 + bY, xStart: 10, xEnd: 21, color: C.tunicMid },
        { y: 20 + bY, xStart: 23, xEnd: 24, color: C.steelDark },
        { y: 21 + bY, xStart: 10, xEnd: 21, color: C.outline }
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
        { y: 20, xStart: 11, xEnd: 14, color: C.steelDark },
        { y: 20, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 21, xStart: 11, xEnd: 14, color: C.steelMid },
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
        { y: 13 + bY, xStart: 6, xEnd: 9, color: C.steelMid },
        { y: 13 + bY, xStart: 10, xEnd: 21, color: C.crimsonMid },
        { y: 13 + bY, xStart: 22, xEnd: 25, color: C.steelDark },
        { y: 14 + bY, xStart: 6, xEnd: 8, color: C.steelDark },
        { y: 14 + bY, xStart: 9, xEnd: 14, color: gleam ? C.crimsonLight : C.crimsonMid },
        { y: 14 + bY, xStart: 15, xEnd: 22, color: C.crimsonDark },
        { y: 14 + bY, xStart: 23, xEnd: 25, color: C.steelDark },
        { y: 15 + bY, xStart: 8, xEnd: 14, color: gleam ? C.crimsonLight : C.crimsonMid },
        { y: 15 + bY, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 16 + bY, xStart: 8, xEnd: 14, color: C.crimsonMid },
        { y: 16 + bY, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 17 + bY, xStart: 8, xEnd: 14, color: C.crimsonMid },
        { y: 17 + bY, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 18 + bY, xStart: 8, xEnd: 14, color: C.crimsonMid },
        { y: 18 + bY, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 19 + bY, xStart: 8, xEnd: 23, color: C.crimsonMid },
        { y: 20 + bY, xStart: 8, xEnd: 23, color: C.crimsonDark },
        { y: 21 + bY, xStart: 8, xEnd: 23, color: C.outline }
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
        { y: 15 + bY, xStart: 18, xEnd: 20, color: C.skinBase },
        { y: 16 + bY, xStart: 18, xEnd: 20, color: C.skinShadow },
        { y: 20, xStart: 13, xEnd: 17, color: C.steelLight },
        { y: 20, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 21, xStart: 13, xEnd: 17, color: C.steelLight },
        { y: 21, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 22, xStart: 13, xEnd: 17, color: C.steelMid },
        { y: 22, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 23, xStart: 13, xEnd: 17, color: C.steelMid },
        { y: 23, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 24, xStart: 13, xEnd: 17, color: C.steelMid },
        { y: 24, xStart: 10, xEnd: 13, color: C.steelDark },
        { y: 25, xStart: 13, xEnd: 18, color: C.steelLight },
        { y: 25, xStart: 9, xEnd: 13, color: C.steelMid },
        { y: 26, xStart: 13, xEnd: 18, color: C.outline },
        { y: 26, xStart: 9, xEnd: 13, color: C.outline }
      ];

      const rightClothRuns: PixelRun[] = [
        { y: 12 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 12 + bY, xStart: 11, xEnd: 17, color: C.steelLight },
        { y: 12 + bY, xStart: 18, xEnd: 20, color: C.goldLight },
        { y: 13 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 13 + bY, xStart: 11, xEnd: 18, color: C.steelMid },
        { y: 13 + bY, xStart: 19, xEnd: 21, color: C.goldMid },
        { y: 14 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 14 + bY, xStart: 11, xEnd: 17, color: C.steelMid },
        { y: 14 + bY, xStart: 18, xEnd: 21, color: C.steelLight },
        { y: 14 + bY, xStart: 22, xEnd: 22, color: C.goldMid },
        { y: 15 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 15 + bY, xStart: 11, xEnd: 16, color: C.steelLight },
        { y: 15 + bY, xStart: 17, xEnd: 17, color: C.goldLight },
        { y: 15 + bY, xStart: 21, xEnd: 23, color: C.goldMid },
        { y: 16 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 16 + bY, xStart: 11, xEnd: 16, color: C.steelMid },
        { y: 16 + bY, xStart: 17, xEnd: 17, color: C.goldMid },
        { y: 16 + bY, xStart: 21, xEnd: 23, color: C.crimsonMid },
        { y: 17 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 17 + bY, xStart: 11, xEnd: 16, color: C.leatherMid },
        { y: 17 + bY, xStart: 17, xEnd: 18, color: C.goldMid },
        { y: 17 + bY, xStart: 21, xEnd: 23, color: C.goldMid },
        { y: 18 + bY, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 18 + bY, xStart: 10, xEnd: 18, color: C.tunicMid },
        { y: 18 + bY, xStart: 19, xEnd: 21, color: C.goldMid },
        { y: 19 + bY, xStart: 7, xEnd: 10, color: C.crimsonDark },
        { y: 19 + bY, xStart: 10, xEnd: 18, color: C.tunicDark },
        { y: 20 + bY, xStart: 7, xEnd: 10, color: C.outline },
        { y: 20 + bY, xStart: 10, xEnd: 18, color: C.tunicMid },
        { y: 21 + bY, xStart: 10, xEnd: 18, color: C.outline }
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
      const rightFootShift = step < 0 ? -1 : step > 0 ? 1 : 0;
      const armSwing = step;

      bodyRuns = [
        { y: 15 + bob, xStart: 7 + armSwing, xEnd: 9 + armSwing, color: C.skinBase },
        { y: 15 + bob, xStart: 22 - armSwing, xEnd: 24 - armSwing, color: C.skinBase },
        { y: 16 + bob, xStart: 7 + armSwing, xEnd: 9 + armSwing, color: C.skinBase },
        { y: 16 + bob, xStart: 22 - armSwing, xEnd: 24 - armSwing, color: C.skinBase },
        { y: 17 + bob, xStart: 7 + armSwing, xEnd: 9 + armSwing, color: C.skinShadow },
        { y: 17 + bob, xStart: 22 - armSwing, xEnd: 24 - armSwing, color: C.skinShadow },
        { y: 20 + bob, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 20 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 21, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 21, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 22, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 22, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 23, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 23, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 24, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 24, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 25, xStart: 10 + leftFootShift, xEnd: 14 + leftFootShift, color: C.steelLight },
        { y: 25, xStart: 17 + rightFootShift, xEnd: 21 + rightFootShift, color: C.steelMid },
        { y: 26, xStart: 10 + leftFootShift, xEnd: 14 + leftFootShift, color: C.outline },
        { y: 26, xStart: 17 + rightFootShift, xEnd: 21 + rightFootShift, color: C.outline }
      ];

      clothRuns = [
        { y: 12 + bob, xStart: 7, xEnd: 10, color: C.goldLight },
        { y: 12 + bob, xStart: 11, xEnd: 20, color: C.steelLight },
        { y: 12 + bob, xStart: 21, xEnd: 24, color: C.goldMid },
        { y: 13 + bob, xStart: 6, xEnd: 10, color: C.steelLight },
        { y: 13 + bob, xStart: 11, xEnd: 14, color: C.steelLight },
        { y: 13 + bob, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 13 + bob, xStart: 17, xEnd: 20, color: C.steelMid },
        { y: 13 + bob, xStart: 21, xEnd: 25, color: C.steelMid },
        { y: 14 + bob, xStart: 6, xEnd: 10, color: C.steelMid },
        { y: 14 + bob, xStart: 11, xEnd: 12, color: C.steelLight },
        { y: 14 + bob, xStart: 13, xEnd: 18, color: C.goldLight },
        { y: 14 + bob, xStart: 19, xEnd: 20, color: C.steelDark },
        { y: 14 + bob, xStart: 21, xEnd: 25, color: C.steelDark },
        { y: 15 + bob, xStart: 6, xEnd: 9, color: C.goldMid },
        { y: 15 + bob, xStart: 10, xEnd: 14, color: C.steelLight },
        { y: 15 + bob, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 15 + bob, xStart: 17, xEnd: 21, color: C.steelDark },
        { y: 15 + bob, xStart: 22, xEnd: 25, color: C.goldDark },
        { y: 16 + bob, xStart: 6 + armSwing, xEnd: 6 + armSwing, color: C.goldMid },
        { y: 16 + bob, xStart: 7 + armSwing, xEnd: 8 + armSwing, color: C.crimsonMid },
        { y: 16 + bob, xStart: 9 + armSwing, xEnd: 9 + armSwing, color: C.goldMid },
        { y: 16 + bob, xStart: 10, xEnd: 14, color: C.steelMid },
        { y: 16 + bob, xStart: 15, xEnd: 16, color: C.steelLight },
        { y: 16 + bob, xStart: 17, xEnd: 21, color: C.steelDark },
        { y: 16 + bob, xStart: 22 - armSwing, xEnd: 23 - armSwing, color: C.leatherMid },
        { y: 16 + bob, xStart: 24 - armSwing, xEnd: 24 - armSwing, color: C.goldLight },
        { y: 17 + bob, xStart: 6 + armSwing, xEnd: 6 + armSwing, color: C.goldMid },
        { y: 17 + bob, xStart: 7 + armSwing, xEnd: 8 + armSwing, color: C.crimsonMid },
        { y: 17 + bob, xStart: 9 + armSwing, xEnd: 9 + armSwing, color: C.goldMid },
        { y: 17 + bob, xStart: 10, xEnd: 14, color: C.leatherMid },
        { y: 17 + bob, xStart: 15, xEnd: 16, color: C.goldLight },
        { y: 17 + bob, xStart: 17, xEnd: 21, color: C.leatherDark },
        { y: 17 + bob, xStart: 22 - armSwing, xEnd: 23 - armSwing, color: C.leatherDark },
        { y: 17 + bob, xStart: 24 - armSwing, xEnd: 24 - armSwing, color: C.goldMid },
        { y: 18 + bob, xStart: 6, xEnd: 6, color: C.goldMid },
        { y: 18 + bob, xStart: 7, xEnd: 8, color: C.crimsonDark },
        { y: 18 + bob, xStart: 9, xEnd: 9, color: C.goldMid },
        { y: 18 + bob, xStart: 10, xEnd: 21, color: C.tunicMid },
        { y: 18 + bob, xStart: 23, xEnd: 24, color: C.steelLight },
        { y: 19 + bob, xStart: 7, xEnd: 8, color: C.crimsonDark },
        { y: 19 + bob, xStart: 9, xEnd: 22, color: C.tunicDark },
        { y: 19 + bob, xStart: 23, xEnd: 24, color: C.steelMid },
        { y: 20 + bob, xStart: 8, xEnd: 8, color: C.outline },
        { y: 20 + bob, xStart: 10, xEnd: 21, color: C.tunicMid },
        { y: 20 + bob, xStart: 23, xEnd: 24, color: C.steelDark },
        { y: 21 + bob, xStart: 10, xEnd: 21, color: C.outline }
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
      const leftFootShift = step < 0 ? 1 : step > 0 ? -1 : 0;
      const rightFootShift = step < 0 ? -1 : step > 0 ? 1 : 0;

      bodyRuns = [
        { y: 20 + bob, xStart: 11, xEnd: 14, color: C.steelDark },
        { y: 20 + bob, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 21, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 21, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 22, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 22, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 23, xStart: 11, xEnd: 14, color: C.steelMid },
        { y: 23, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 24, xStart: 11, xEnd: 14, color: C.steelDark },
        { y: 24, xStart: 17, xEnd: 20, color: C.steelDark },
        { y: 25, xStart: 10 + leftFootShift, xEnd: 14 + leftFootShift, color: C.steelMid },
        { y: 25, xStart: 17 + rightFootShift, xEnd: 21 + rightFootShift, color: C.steelDark },
        { y: 26, xStart: 10 + leftFootShift, xEnd: 14 + leftFootShift, color: C.outline },
        { y: 26, xStart: 17 + rightFootShift, xEnd: 21 + rightFootShift, color: C.outline }
      ];

      clothRuns = [
        { y: 12 + bob, xStart: 7, xEnd: 9, color: C.steelMid },
        { y: 12 + bob, xStart: 10, xEnd: 21, color: C.crimsonMid },
        { y: 12 + bob, xStart: 22, xEnd: 24, color: C.steelDark },
        { y: 13 + bob, xStart: 6, xEnd: 9, color: C.steelMid },
        { y: 13 + bob, xStart: 10, xEnd: 21, color: C.crimsonMid },
        { y: 13 + bob, xStart: 22, xEnd: 25, color: C.steelDark },
        { y: 14 + bob, xStart: 6, xEnd: 8, color: C.steelDark },
        { y: 14 + bob, xStart: 9, xEnd: 14, color: C.crimsonMid },
        { y: 14 + bob, xStart: 15, xEnd: 22, color: C.crimsonDark },
        { y: 14 + bob, xStart: 23, xEnd: 25, color: C.steelDark },
        { y: 15 + bob, xStart: 8, xEnd: 14, color: C.crimsonMid },
        { y: 15 + bob, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 16 + bob, xStart: 8, xEnd: 14, color: C.crimsonMid },
        { y: 16 + bob, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 17 + bob, xStart: 8, xEnd: 14, color: C.crimsonMid },
        { y: 17 + bob, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 18 + bob, xStart: 8, xEnd: 14, color: C.crimsonMid },
        { y: 18 + bob, xStart: 15, xEnd: 23, color: C.crimsonDark },
        { y: 19 + bob, xStart: 8, xEnd: 23, color: C.crimsonMid },
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
      const stride = step * 2;
      const rightBodyRuns: PixelRun[] = [
        { y: 15 + bob, xStart: 18, xEnd: 20, color: C.skinBase },
        { y: 16 + bob, xStart: 18, xEnd: 20, color: C.skinShadow },
        { y: 20 + bob, xStart: 13 + stride, xEnd: 17 + stride, color: C.steelLight },
        { y: 20 + bob, xStart: 10 - stride, xEnd: 13 - stride, color: C.steelDark },
        { y: 21, xStart: 13 + stride, xEnd: 17 + stride, color: C.steelLight },
        { y: 21, xStart: 10 - stride, xEnd: 13 - stride, color: C.steelDark },
        { y: 22, xStart: 13 + stride, xEnd: 17 + stride, color: C.steelMid },
        { y: 22, xStart: 10 - stride, xEnd: 13 - stride, color: C.steelDark },
        { y: 23, xStart: 13 + stride, xEnd: 17 + stride, color: C.steelMid },
        { y: 23, xStart: 10 - stride, xEnd: 13 - stride, color: C.steelDark },
        { y: 24, xStart: 13 + stride, xEnd: 17 + stride, color: C.steelMid },
        { y: 24, xStart: 10 - stride, xEnd: 13 - stride, color: C.steelDark },
        { y: 25, xStart: 13 + stride, xEnd: 18 + stride, color: C.steelLight },
        { y: 25, xStart: 9 - stride, xEnd: 13 - stride, color: C.steelMid },
        { y: 26, xStart: 13 + stride, xEnd: 18 + stride, color: C.outline },
        { y: 26, xStart: 9 - stride, xEnd: 13 - stride, color: C.outline }
      ];

      const rightClothRuns: PixelRun[] = [
        { y: 12 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 12 + bob, xStart: 11, xEnd: 17, color: C.steelLight },
        { y: 12 + bob, xStart: 18, xEnd: 20, color: C.goldLight },
        { y: 13 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 13 + bob, xStart: 11, xEnd: 18, color: C.steelMid },
        { y: 13 + bob, xStart: 19, xEnd: 21, color: C.goldMid },
        { y: 14 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 14 + bob, xStart: 11, xEnd: 17, color: C.steelMid },
        { y: 14 + bob, xStart: 18, xEnd: 21, color: C.steelLight },
        { y: 14 + bob, xStart: 22, xEnd: 22, color: C.goldMid },
        { y: 15 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 15 + bob, xStart: 11, xEnd: 16, color: C.steelLight },
        { y: 15 + bob, xStart: 17, xEnd: 17, color: C.goldLight },
        { y: 15 + bob, xStart: 21, xEnd: 23, color: C.goldMid },
        { y: 16 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 16 + bob, xStart: 11, xEnd: 16, color: C.steelMid },
        { y: 16 + bob, xStart: 17, xEnd: 17, color: C.goldMid },
        { y: 16 + bob, xStart: 21, xEnd: 23, color: C.crimsonMid },
        { y: 17 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 17 + bob, xStart: 11, xEnd: 16, color: C.leatherMid },
        { y: 17 + bob, xStart: 17, xEnd: 18, color: C.goldMid },
        { y: 17 + bob, xStart: 21, xEnd: 23, color: C.goldMid },
        { y: 18 + bob, xStart: 7, xEnd: 10, color: C.crimsonMid },
        { y: 18 + bob, xStart: 10, xEnd: 18, color: C.tunicMid },
        { y: 18 + bob, xStart: 19, xEnd: 21, color: C.goldMid },
        { y: 19 + bob, xStart: 7, xEnd: 10, color: C.crimsonDark },
        { y: 19 + bob, xStart: 10, xEnd: 18, color: C.tunicDark },
        { y: 20 + bob, xStart: 7, xEnd: 10, color: C.outline },
        { y: 20 + bob, xStart: 10, xEnd: 18, color: C.tunicMid },
        { y: 21 + bob, xStart: 10, xEnd: 18, color: C.outline }
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
      cursorTarget: { x: 15, y: 14 + bob },
      layerUpdates
    });
  }

  return keyframes;
}

export function getKnightHarvestKeyframes(startFrame: number, fps: number): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  for (let i = 0; i < 6; i++) {
    const frameIndex = startFrame + i;
    const crouch = (i === 0 || i === 1) ? 2 : 0;
    const lift = (i === 3 || i === 4) ? -3 : 0;

    const bodyRuns: PixelRun[] = [
      { y: 16 + crouch + lift, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 16 + crouch + lift, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 17 + crouch + lift, xStart: 7, xEnd: 9, color: C.skinShadow },
      { y: 17 + crouch + lift, xStart: 22, xEnd: 24, color: C.skinShadow },
      { y: 20 + crouch, xStart: 11, xEnd: 14, color: C.steelMid },
      { y: 20 + crouch, xStart: 17, xEnd: 20, color: C.steelDark },
      { y: 21, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 21, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 22, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 22, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 23, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 23, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 24, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 24, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 25, xStart: 9, xEnd: 14, color: C.steelLight },
      { y: 25, xStart: 17, xEnd: 22, color: C.steelMid },
      { y: 26, xStart: 9, xEnd: 14, color: C.outline },
      { y: 26, xStart: 17, xEnd: 22, color: C.outline }
    ];

    const clothRuns: PixelRun[] = [
      { y: 12 + crouch + lift, xStart: 7, xEnd: 10, color: C.goldLight },
      { y: 12 + crouch + lift, xStart: 11, xEnd: 20, color: C.steelLight },
      { y: 12 + crouch + lift, xStart: 21, xEnd: 24, color: C.goldMid },
      { y: 13 + crouch + lift, xStart: 6, xEnd: 10, color: C.steelLight },
      { y: 13 + crouch + lift, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 13 + crouch + lift, xStart: 21, xEnd: 25, color: C.steelMid },
      { y: 14 + crouch + lift, xStart: 6, xEnd: 10, color: C.steelMid },
      { y: 14 + crouch + lift, xStart: 11, xEnd: 20, color: C.steelDark },
      { y: 14 + crouch + lift, xStart: 21, xEnd: 25, color: C.steelDark },
      { y: 15 + crouch + lift, xStart: 6, xEnd: 9, color: C.goldMid },
      { y: 15 + crouch + lift, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 15 + crouch + lift, xStart: 22, xEnd: 25, color: C.goldDark },
      { y: 16 + crouch + lift, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 17 + crouch + lift, xStart: 10, xEnd: 21, color: C.leatherMid },
      { y: 18 + crouch + lift, xStart: 10, xEnd: 21, color: C.tunicMid },
      { y: 19 + crouch + lift, xStart: 9, xEnd: 22, color: C.tunicDark },
      { y: 20 + crouch + lift, xStart: 9, xEnd: 22, color: C.tunicMid },
      { y: 21 + crouch + lift, xStart: 10, xEnd: 21, color: C.outline }
    ];

    if (i === 0 || i === 1) {
      clothRuns.push(
        { y: 24, xStart: 15, xEnd: 16, color: C.cropGold },
        { y: 25, xStart: 14, xEnd: 17, color: C.cropGold },
        { y: 26, xStart: 15, xEnd: 16, color: C.cropLeaf }
      );
    } else if (i === 2) {
      clothRuns.push(
        { y: 17, xStart: 14, xEnd: 17, color: C.cropGold },
        { y: 18, xStart: 14, xEnd: 17, color: C.cropGold },
        { y: 19, xStart: 15, xEnd: 16, color: C.cropLeaf }
      );
    } else {
      clothRuns.push(
        { y: 1, xStart: 13, xEnd: 18, color: C.cropGold },
        { y: 2, xStart: 12, xEnd: 19, color: C.cropGold },
        { y: 3, xStart: 13, xEnd: 18, color: C.cropGold },
        { y: 4, xStart: 15, xEnd: 16, color: C.cropLeaf }
      );
    }

    const hairRuns: PixelRun[] = [
      { y: 1 + crouch + lift, xStart: 15, xEnd: 17, color: C.crimsonLight },
      { y: 2 + crouch + lift, xStart: 14, xEnd: 18, color: C.crimsonLight },
      { y: 3 + crouch + lift, xStart: 14, xEnd: 18, color: C.crimsonMid },
      { y: 4 + crouch + lift, xStart: 12, xEnd: 19, color: C.steelLight },
      { y: 5 + crouch + lift, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 6 + crouch + lift, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 7 + crouch + lift, xStart: 10, xEnd: 21, color: C.goldLight },
      { y: 8 + crouch + lift, xStart: 10, xEnd: 21, color: C.outline },
      { y: 9 + crouch + lift, xStart: 10, xEnd: 21, color: C.outline },
      { y: 10 + crouch + lift, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 11 + crouch + lift, xStart: 12, xEnd: 19, color: C.outline }
    ];

    if (i === 4) {
      hairRuns.push(
        { y: 0, xStart: 10, xEnd: 11, color: C.vfxYellow },
        { y: 1, xStart: 10, xEnd: 10, color: C.vfxWhite },
        { y: 0, xStart: 21, xEnd: 22, color: C.vfxYellow },
        { y: 1, xStart: 22, xEnd: 22, color: C.vfxWhite },
        { y: 4, xStart: 9, xEnd: 9, color: C.vfxWhite },
        { y: 4, xStart: 23, xEnd: 23, color: C.vfxWhite }
      );
    }

    keyframes.push({
      frameIndex,
      poseType: "action",
      duration: 1.0 / fps,
      cursorTarget: { x: 15, y: 16 },
      layerUpdates: [
        { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
        { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
        { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
      ]
    });
  }

  return keyframes;
}

export function getKnightMineKeyframes(startFrame: number, fps: number): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  for (let i = 0; i < 6; i++) {
    const frameIndex = startFrame + i;
    const strike = (i === 2 || i === 3);

    const bodyRuns: PixelRun[] = [
      { y: 15, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 15, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 16, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 16, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 17, xStart: 7, xEnd: 9, color: C.skinShadow },
      { y: 17, xStart: 22, xEnd: 24, color: C.skinShadow },
      { y: 20, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 20, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 21, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 21, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 22, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 22, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 23, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 23, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 24, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 24, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 25, xStart: 9, xEnd: 14, color: C.steelLight },
      { y: 25, xStart: 17, xEnd: 22, color: C.steelMid },
      { y: 26, xStart: 9, xEnd: 14, color: C.outline },
      { y: 26, xStart: 17, xEnd: 22, color: C.outline }
    ];

    const clothRuns: PixelRun[] = [
      { y: 12, xStart: 7, xEnd: 10, color: C.goldLight },
      { y: 12, xStart: 11, xEnd: 20, color: C.steelLight },
      { y: 12, xStart: 21, xEnd: 24, color: C.goldMid },
      { y: 13, xStart: 6, xEnd: 10, color: C.steelLight },
      { y: 13, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 13, xStart: 21, xEnd: 25, color: C.steelMid },
      { y: 14, xStart: 6, xEnd: 10, color: C.steelMid },
      { y: 14, xStart: 11, xEnd: 20, color: C.steelDark },
      { y: 14, xStart: 21, xEnd: 25, color: C.steelDark },
      { y: 15, xStart: 6, xEnd: 9, color: C.goldMid },
      { y: 15, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 15, xStart: 22, xEnd: 25, color: C.goldDark },
      { y: 16, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 17, xStart: 10, xEnd: 21, color: C.leatherMid },
      { y: 18, xStart: 10, xEnd: 21, color: C.tunicMid },
      { y: 19, xStart: 9, xEnd: 22, color: C.tunicDark },
      { y: 20, xStart: 9, xEnd: 22, color: C.tunicMid },
      { y: 21, xStart: 10, xEnd: 21, color: C.outline }
    ];

    if (i === 1) {
      clothRuns.push(
        { y: 2, xStart: 8, xEnd: 14, color: C.steelLight },
        { y: 3, xStart: 10, xEnd: 12, color: C.steelWhite },
        { y: 4, xStart: 13, xEnd: 15, color: C.woodMid },
        { y: 5, xStart: 16, xEnd: 18, color: C.woodMid },
        { y: 6, xStart: 19, xEnd: 21, color: C.woodDark }
      );
    } else if (strike) {
      clothRuns.push(
        { y: 18, xStart: 17, xEnd: 20, color: C.woodDark },
        { y: 19, xStart: 18, xEnd: 21, color: C.woodMid },
        { y: 20, xStart: 19, xEnd: 22, color: C.woodMid },
        { y: 21, xStart: 20, xEnd: 24, color: C.steelLight },
        { y: 22, xStart: 22, xEnd: 25, color: C.steelWhite }
      );
    } else {
      clothRuns.push(
        { y: 14, xStart: 23, xEnd: 26, color: C.steelLight },
        { y: 15, xStart: 22, xEnd: 24, color: C.woodMid },
        { y: 16, xStart: 21, xEnd: 23, color: C.woodDark }
      );
    }

    clothRuns.push(
      { y: 24, xStart: 22, xEnd: 26, color: C.oreGrey },
      { y: 25, xStart: 21, xEnd: 27, color: C.oreGrey },
      { y: 25, xStart: 23, xEnd: 25, color: C.oreGem },
      { y: 26, xStart: 21, xEnd: 27, color: C.outline }
    );

    const hairRuns: PixelRun[] = [
      { y: 1, xStart: 15, xEnd: 17, color: C.crimsonLight },
      { y: 2, xStart: 14, xEnd: 18, color: C.crimsonLight },
      { y: 3, xStart: 14, xEnd: 18, color: C.crimsonMid },
      { y: 4, xStart: 12, xEnd: 19, color: C.steelLight },
      { y: 5, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 6, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 7, xStart: 10, xEnd: 21, color: C.goldLight },
      { y: 8, xStart: 10, xEnd: 21, color: C.outline },
      { y: 9, xStart: 10, xEnd: 21, color: C.outline },
      { y: 10, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 11, xStart: 12, xEnd: 19, color: C.outline }
    ];

    if (i === 3) {
      hairRuns.push(
        { y: 19, xStart: 22, xEnd: 23, color: C.vfxYellow },
        { y: 20, xStart: 25, xEnd: 26, color: C.vfxCyan },
        { y: 21, xStart: 26, xEnd: 27, color: C.vfxWhite },
        { y: 22, xStart: 21, xEnd: 21, color: C.vfxYellow },
        { y: 23, xStart: 27, xEnd: 28, color: C.vfxCyan }
      );
    }

    keyframes.push({
      frameIndex,
      poseType: "action",
      duration: 1.0 / fps,
      cursorTarget: { x: 22, y: 22 },
      layerUpdates: [
        { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
        { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
        { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
      ]
    });
  }

  return keyframes;
}

export function getKnightChopKeyframes(startFrame: number, fps: number): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  for (let i = 0; i < 6; i++) {
    const frameIndex = startFrame + i;

    const bodyRuns: PixelRun[] = [
      { y: 15, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 15, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 16, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 16, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 17, xStart: 7, xEnd: 9, color: C.skinShadow },
      { y: 17, xStart: 22, xEnd: 24, color: C.skinShadow },
      { y: 20, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 20, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 21, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 21, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 22, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 22, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 23, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 23, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 24, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 24, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 25, xStart: 9, xEnd: 14, color: C.steelLight },
      { y: 25, xStart: 17, xEnd: 22, color: C.steelMid },
      { y: 26, xStart: 9, xEnd: 14, color: C.outline },
      { y: 26, xStart: 17, xEnd: 22, color: C.outline }
    ];

    const clothRuns: PixelRun[] = [
      { y: 12, xStart: 7, xEnd: 10, color: C.goldLight },
      { y: 12, xStart: 11, xEnd: 20, color: C.steelLight },
      { y: 12, xStart: 21, xEnd: 24, color: C.goldMid },
      { y: 13, xStart: 6, xEnd: 10, color: C.steelLight },
      { y: 13, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 13, xStart: 21, xEnd: 25, color: C.steelMid },
      { y: 14, xStart: 6, xEnd: 10, color: C.steelMid },
      { y: 14, xStart: 11, xEnd: 20, color: C.steelDark },
      { y: 14, xStart: 21, xEnd: 25, color: C.steelDark },
      { y: 15, xStart: 6, xEnd: 9, color: C.goldMid },
      { y: 15, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 15, xStart: 22, xEnd: 25, color: C.goldDark },
      { y: 16, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 17, xStart: 10, xEnd: 21, color: C.leatherMid },
      { y: 18, xStart: 10, xEnd: 21, color: C.tunicMid },
      { y: 19, xStart: 9, xEnd: 22, color: C.tunicDark },
      { y: 20, xStart: 9, xEnd: 22, color: C.tunicMid },
      { y: 21, xStart: 10, xEnd: 21, color: C.outline }
    ];

    if (i === 1) {
      clothRuns.push(
        { y: 6, xStart: 4, xEnd: 8, color: C.steelLight },
        { y: 7, xStart: 3, xEnd: 9, color: C.steelWhite },
        { y: 8, xStart: 5, xEnd: 8, color: C.steelMid },
        { y: 9, xStart: 8, xEnd: 10, color: C.woodMid },
        { y: 10, xStart: 10, xEnd: 12, color: C.woodDark }
      );
    } else if (i === 2 || i === 3) {
      clothRuns.push(
        { y: 14, xStart: 15, xEnd: 22, color: C.woodMid },
        { y: 13, xStart: 22, xEnd: 26, color: C.steelLight },
        { y: 14, xStart: 23, xEnd: 27, color: C.steelWhite },
        { y: 15, xStart: 22, xEnd: 26, color: C.steelMid }
      );
    } else {
      clothRuns.push(
        { y: 15, xStart: 22, xEnd: 25, color: C.woodMid },
        { y: 16, xStart: 24, xEnd: 27, color: C.steelLight }
      );
    }

    const hairRuns: PixelRun[] = [
      { y: 1, xStart: 15, xEnd: 17, color: C.crimsonLight },
      { y: 2, xStart: 14, xEnd: 18, color: C.crimsonLight },
      { y: 3, xStart: 14, xEnd: 18, color: C.crimsonMid },
      { y: 4, xStart: 12, xEnd: 19, color: C.steelLight },
      { y: 5, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 6, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 7, xStart: 10, xEnd: 21, color: C.goldLight },
      { y: 8, xStart: 10, xEnd: 21, color: C.outline },
      { y: 9, xStart: 10, xEnd: 21, color: C.outline },
      { y: 10, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 11, xStart: 12, xEnd: 19, color: C.outline }
    ];

    if (i === 3) {
      hairRuns.push(
        { y: 11, xStart: 27, xEnd: 28, color: C.woodLight },
        { y: 12, xStart: 28, xEnd: 29, color: C.woodMid },
        { y: 14, xStart: 28, xEnd: 29, color: C.vfxWhite },
        { y: 15, xStart: 29, xEnd: 30, color: C.woodLight },
        { y: 17, xStart: 27, xEnd: 28, color: C.cropLeaf }
      );
    }

    keyframes.push({
      frameIndex,
      poseType: "action",
      duration: 1.0 / fps,
      cursorTarget: { x: 25, y: 14 },
      layerUpdates: [
        { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
        { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
        { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
      ]
    });
  }

  return keyframes;
}

export function getKnightAttackKeyframes(startFrame: number, fps: number): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  for (let i = 0; i < 6; i++) {
    const frameIndex = startFrame + i;

    const bodyRuns: PixelRun[] = [
      { y: 15, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 15, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 16, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 16, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 17, xStart: 7, xEnd: 9, color: C.skinShadow },
      { y: 17, xStart: 22, xEnd: 24, color: C.skinShadow },
      { y: 20, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 20, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 21, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 21, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 22, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 22, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 23, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 23, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 24, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 24, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 25, xStart: 9, xEnd: 14, color: C.steelLight },
      { y: 25, xStart: 17, xEnd: 22, color: C.steelMid },
      { y: 26, xStart: 9, xEnd: 14, color: C.outline },
      { y: 26, xStart: 17, xEnd: 22, color: C.outline }
    ];

    const clothRuns: PixelRun[] = [
      { y: 12, xStart: 7, xEnd: 10, color: C.goldLight },
      { y: 12, xStart: 11, xEnd: 20, color: C.steelLight },
      { y: 12, xStart: 21, xEnd: 24, color: C.goldMid },
      { y: 13, xStart: 6, xEnd: 10, color: C.steelLight },
      { y: 13, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 13, xStart: 21, xEnd: 25, color: C.steelMid },
      { y: 14, xStart: 6, xEnd: 10, color: C.steelMid },
      { y: 14, xStart: 11, xEnd: 20, color: C.steelDark },
      { y: 14, xStart: 21, xEnd: 25, color: C.steelDark },
      { y: 15, xStart: 6, xEnd: 9, color: C.goldMid },
      { y: 15, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 15, xStart: 22, xEnd: 25, color: C.goldDark },
      { y: 16, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 17, xStart: 10, xEnd: 21, color: C.leatherMid },
      { y: 18, xStart: 10, xEnd: 21, color: C.tunicMid },
      { y: 19, xStart: 9, xEnd: 22, color: C.tunicDark },
      { y: 20, xStart: 9, xEnd: 22, color: C.tunicMid },
      { y: 21, xStart: 10, xEnd: 21, color: C.outline }
    ];

    if (i === 1) {
      clothRuns.push(
        { y: 14, xStart: 20, xEnd: 23, color: C.goldLight },
        { y: 15, xStart: 18, xEnd: 22, color: C.steelWhite },
        { y: 16, xStart: 17, xEnd: 20, color: C.steelLight }
      );
    } else if (i === 2 || i === 3) {
      clothRuns.push(
        { y: 15, xStart: 18, xEnd: 21, color: C.goldLight },
        { y: 15, xStart: 22, xEnd: 28, color: C.steelWhite },
        { y: 16, xStart: 22, xEnd: 27, color: C.steelLight }
      );
    } else {
      clothRuns.push(
        { y: 15, xStart: 22, xEnd: 25, color: C.steelLight },
        { y: 16, xStart: 22, xEnd: 24, color: C.goldMid }
      );
    }

    const hairRuns: PixelRun[] = [
      { y: 1, xStart: 15, xEnd: 17, color: C.crimsonLight },
      { y: 2, xStart: 14, xEnd: 18, color: C.crimsonLight },
      { y: 3, xStart: 14, xEnd: 18, color: C.crimsonMid },
      { y: 4, xStart: 12, xEnd: 19, color: C.steelLight },
      { y: 5, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 6, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 7, xStart: 10, xEnd: 21, color: C.goldLight },
      { y: 8, xStart: 10, xEnd: 21, color: C.outline },
      { y: 9, xStart: 10, xEnd: 21, color: C.outline },
      { y: 10, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 11, xStart: 12, xEnd: 19, color: C.outline }
    ];

    if (i === 3) {
      hairRuns.push(
        { y: 12, xStart: 23, xEnd: 27, color: C.vfxCyan },
        { y: 13, xStart: 25, xEnd: 30, color: C.vfxWhite },
        { y: 14, xStart: 26, xEnd: 31, color: C.vfxWhite },
        { y: 15, xStart: 28, xEnd: 31, color: C.vfxCyan },
        { y: 16, xStart: 27, xEnd: 30, color: C.steelLight }
      );
    }

    keyframes.push({
      frameIndex,
      poseType: "action",
      duration: 1.0 / fps,
      cursorTarget: { x: 26, y: 15 },
      layerUpdates: [
        { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
        { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
        { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
      ]
    });
  }

  return keyframes;
}

export function getKnightSkillKeyframes(startFrame: number, fps: number): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  for (let i = 0; i < 6; i++) {
    const frameIndex = startFrame + i;
    const isBurst = (i === 3 || i === 4);

    const bodyRuns: PixelRun[] = [
      { y: 15, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 15, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 16, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 16, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: 17, xStart: 7, xEnd: 9, color: C.skinShadow },
      { y: 17, xStart: 22, xEnd: 24, color: C.skinShadow },
      { y: 20, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 20, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 21, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 21, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 22, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 22, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 23, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 23, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 24, xStart: 10, xEnd: 14, color: C.steelMid },
      { y: 24, xStart: 17, xEnd: 21, color: C.steelDark },
      { y: 25, xStart: 9, xEnd: 14, color: C.steelLight },
      { y: 25, xStart: 17, xEnd: 22, color: C.steelMid },
      { y: 26, xStart: 9, xEnd: 14, color: C.outline },
      { y: 26, xStart: 17, xEnd: 22, color: C.outline }
    ];

    const clothRuns: PixelRun[] = [
      { y: 12, xStart: 7, xEnd: 10, color: C.goldLight },
      { y: 12, xStart: 11, xEnd: 20, color: C.steelLight },
      { y: 12, xStart: 21, xEnd: 24, color: C.goldMid },
      { y: 13, xStart: 6, xEnd: 10, color: C.steelLight },
      { y: 13, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 13, xStart: 21, xEnd: 25, color: C.steelMid },
      { y: 14, xStart: 6, xEnd: 10, color: C.steelMid },
      { y: 14, xStart: 11, xEnd: 20, color: C.steelDark },
      { y: 14, xStart: 21, xEnd: 25, color: C.steelDark },
      { y: 15, xStart: 6, xEnd: 9, color: C.goldMid },
      { y: 15, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 15, xStart: 22, xEnd: 25, color: C.goldDark },
      { y: 16, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 17, xStart: 10, xEnd: 21, color: C.leatherMid },
      { y: 18, xStart: 10, xEnd: 21, color: C.tunicMid },
      { y: 19, xStart: 9, xEnd: 22, color: C.tunicDark },
      { y: 20, xStart: 9, xEnd: 22, color: C.tunicMid },
      { y: 21, xStart: 10, xEnd: 21, color: C.outline }
    ];

    clothRuns.push(
      { y: 2, xStart: 15, xEnd: 16, color: C.steelWhite },
      { y: 3, xStart: 15, xEnd: 16, color: C.steelWhite },
      { y: 4, xStart: 15, xEnd: 16, color: C.steelLight },
      { y: 5, xStart: 15, xEnd: 16, color: C.steelMid },
      { y: 6, xStart: 14, xEnd: 17, color: C.goldLight },
      { y: 7, xStart: 15, xEnd: 16, color: C.goldMid }
    );

    const hairRuns: PixelRun[] = [
      { y: 1, xStart: 15, xEnd: 17, color: C.crimsonLight },
      { y: 2, xStart: 14, xEnd: 18, color: C.crimsonLight },
      { y: 3, xStart: 14, xEnd: 18, color: C.crimsonMid },
      { y: 4, xStart: 12, xEnd: 19, color: C.steelLight },
      { y: 5, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 6, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 7, xStart: 10, xEnd: 21, color: C.goldLight },
      { y: 8, xStart: 10, xEnd: 21, color: C.outline },
      { y: 9, xStart: 10, xEnd: 21, color: C.outline },
      { y: 10, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 11, xStart: 12, xEnd: 19, color: C.outline }
    ];

    if (isBurst) {
      hairRuns.push(
        { y: 0, xStart: 14, xEnd: 17, color: C.vfxWhite },
        { y: 1, xStart: 13, xEnd: 18, color: C.vfxYellow },
        { y: 2, xStart: 12, xEnd: 19, color: C.vfxYellow },
        { y: 0, xStart: 6, xEnd: 8, color: C.vfxYellow },
        { y: 1, xStart: 7, xEnd: 7, color: C.vfxWhite },
        { y: 0, xStart: 23, xEnd: 25, color: C.vfxYellow },
        { y: 1, xStart: 24, xEnd: 24, color: C.vfxWhite },
        { y: 8, xStart: 4, xEnd: 6, color: C.vfxYellow },
        { y: 8, xStart: 25, xEnd: 27, color: C.vfxYellow },
        { y: 18, xStart: 3, xEnd: 5, color: C.vfxYellow },
        { y: 18, xStart: 26, xEnd: 28, color: C.vfxYellow }
      );
    }

    keyframes.push({
      frameIndex,
      poseType: "action",
      duration: 1.0 / fps,
      cursorTarget: { x: 15, y: 3 },
      layerUpdates: [
        { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
        { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
        { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
      ]
    });
  }

  return keyframes;
}

export function getKnightInteractKeyframes(startFrame: number, fps: number): AnimationKeyframe[] {
  const keyframes: AnimationKeyframe[] = [];

  for (let i = 0; i < 4; i++) {
    const frameIndex = startFrame + i;
    const handWaveY = (i % 2 === 1) ? 9 : 11;

    const bodyRuns: PixelRun[] = [
      { y: 15, xStart: 7, xEnd: 9, color: C.skinBase },
      { y: 16, xStart: 7, xEnd: 9, color: C.skinShadow },
      { y: handWaveY, xStart: 22, xEnd: 24, color: C.skinBase },
      { y: handWaveY + 1, xStart: 22, xEnd: 24, color: C.skinShadow },
      { y: 20, xStart: 11, xEnd: 14, color: C.steelMid },
      { y: 20, xStart: 17, xEnd: 20, color: C.steelDark },
      { y: 21, xStart: 11, xEnd: 14, color: C.steelLight },
      { y: 21, xStart: 17, xEnd: 20, color: C.steelMid },
      { y: 22, xStart: 11, xEnd: 14, color: C.steelLight },
      { y: 22, xStart: 17, xEnd: 20, color: C.steelMid },
      { y: 23, xStart: 11, xEnd: 14, color: C.steelMid },
      { y: 23, xStart: 17, xEnd: 20, color: C.steelDark },
      { y: 24, xStart: 11, xEnd: 14, color: C.steelMid },
      { y: 24, xStart: 17, xEnd: 20, color: C.steelDark },
      { y: 25, xStart: 10, xEnd: 14, color: C.steelLight },
      { y: 25, xStart: 17, xEnd: 21, color: C.steelMid },
      { y: 26, xStart: 10, xEnd: 14, color: C.outline },
      { y: 26, xStart: 17, xEnd: 21, color: C.outline }
    ];

    const clothRuns: PixelRun[] = [
      { y: 12, xStart: 7, xEnd: 10, color: C.goldLight },
      { y: 12, xStart: 11, xEnd: 20, color: C.steelLight },
      { y: 12, xStart: 21, xEnd: 24, color: C.goldMid },
      { y: 13, xStart: 6, xEnd: 10, color: C.steelLight },
      { y: 13, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 13, xStart: 21, xEnd: 25, color: C.steelMid },
      { y: 14, xStart: 6, xEnd: 10, color: C.steelMid },
      { y: 14, xStart: 11, xEnd: 20, color: C.steelDark },
      { y: 14, xStart: 21, xEnd: 25, color: C.steelDark },
      { y: 15, xStart: 6, xEnd: 9, color: C.goldMid },
      { y: 15, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 15, xStart: 22, xEnd: 24, color: C.goldDark },
      { y: 16, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 17, xStart: 10, xEnd: 21, color: C.leatherMid },
      { y: 18, xStart: 10, xEnd: 21, color: C.tunicMid },
      { y: 19, xStart: 9, xEnd: 22, color: C.tunicDark },
      { y: 20, xStart: 9, xEnd: 22, color: C.tunicMid },
      { y: 21, xStart: 10, xEnd: 21, color: C.outline }
    ];

    const hairRuns: PixelRun[] = [
      { y: 1, xStart: 15, xEnd: 17, color: C.crimsonLight },
      { y: 2, xStart: 14, xEnd: 18, color: C.crimsonLight },
      { y: 3, xStart: 14, xEnd: 18, color: C.crimsonMid },
      { y: 4, xStart: 12, xEnd: 19, color: C.steelLight },
      { y: 5, xStart: 10, xEnd: 21, color: C.steelLight },
      { y: 6, xStart: 10, xEnd: 21, color: C.steelMid },
      { y: 7, xStart: 10, xEnd: 21, color: C.goldLight },
      { y: 8, xStart: 10, xEnd: 21, color: C.outline },
      { y: 9, xStart: 10, xEnd: 21, color: C.outline },
      { y: 10, xStart: 11, xEnd: 20, color: C.steelMid },
      { y: 11, xStart: 12, xEnd: 19, color: C.outline }
    ];

    if (i >= 1) {
      hairRuns.push(
        { y: 2, xStart: 24, xEnd: 25, color: C.crimsonLight },
        { y: 2, xStart: 27, xEnd: 28, color: C.crimsonLight },
        { y: 3, xStart: 23, xEnd: 29, color: C.crimsonMid },
        { y: 4, xStart: 24, xEnd: 28, color: C.crimsonMid },
        { y: 5, xStart: 25, xEnd: 27, color: C.crimsonDark },
        { y: 6, xStart: 26, xEnd: 26, color: C.crimsonDark }
      );
    }

    keyframes.push({
      frameIndex,
      poseType: "action",
      duration: 1.0 / fps,
      cursorTarget: { x: 23, y: handWaveY },
      layerUpdates: [
        { layerIndex: 1, layerName: "body", runs: bodyRuns, pixels: runsToPixelTuples(bodyRuns) },
        { layerIndex: 2, layerName: "clothing", runs: clothRuns, pixels: runsToPixelTuples(clothRuns) },
        { layerIndex: 3, layerName: "hair", runs: hairRuns, pixels: runsToPixelTuples(hairRuns) }
      ]
    });
  }

  return keyframes;
}
