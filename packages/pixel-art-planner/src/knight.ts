import { PixelRun, PixelTuple } from "@pixelorama/shared";
import { runsToPixelTuples } from "./silhouette.js";

export const KNIGHT_COLORS = {
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

export function getKnightGroundShadowRuns(): PixelRun[] {
  return [
    { y: 27, xStart: 10, xEnd: 21, color: KNIGHT_COLORS.shadow },
    { y: 28, xStart: 9, xEnd: 22, color: KNIGHT_COLORS.shadow },
    { y: 29, xStart: 11, xEnd: 20, color: KNIGHT_COLORS.shadow }
  ];
}

export function getKnightBodyRunsDown(): PixelRun[] {
  return [
    { y: 16, xStart: 7, xEnd: 9, color: KNIGHT_COLORS.skinBase },
    { y: 16, xStart: 22, xEnd: 24, color: KNIGHT_COLORS.skinBase },
    { y: 17, xStart: 7, xEnd: 9, color: KNIGHT_COLORS.skinShadow },
    { y: 17, xStart: 22, xEnd: 24, color: KNIGHT_COLORS.skinShadow },
    { y: 21, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.steelMid },
    { y: 21, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.steelDark },
    { y: 22, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.steelLight },
    { y: 22, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.steelMid },
    { y: 23, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.steelLight },
    { y: 23, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.steelMid },
    { y: 24, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.steelMid },
    { y: 24, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.steelDark },
    { y: 25, xStart: 10, xEnd: 14, color: KNIGHT_COLORS.steelLight },
    { y: 25, xStart: 17, xEnd: 21, color: KNIGHT_COLORS.steelMid },
    { y: 26, xStart: 10, xEnd: 14, color: KNIGHT_COLORS.outline },
    { y: 26, xStart: 17, xEnd: 21, color: KNIGHT_COLORS.outline }
  ];
}

export function getKnightClothingRunsDown(): PixelRun[] {
  return [
    { y: 12, xStart: 7, xEnd: 10, color: KNIGHT_COLORS.goldLight },
    { y: 12, xStart: 11, xEnd: 20, color: KNIGHT_COLORS.steelLight },
    { y: 12, xStart: 21, xEnd: 24, color: KNIGHT_COLORS.goldMid },
    { y: 13, xStart: 7, xEnd: 10, color: KNIGHT_COLORS.steelLight },
    { y: 13, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.steelLight },
    { y: 13, xStart: 15, xEnd: 16, color: KNIGHT_COLORS.goldLight },
    { y: 13, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.steelMid },
    { y: 13, xStart: 21, xEnd: 24, color: KNIGHT_COLORS.steelMid },
    { y: 14, xStart: 7, xEnd: 10, color: KNIGHT_COLORS.steelMid },
    { y: 14, xStart: 11, xEnd: 12, color: KNIGHT_COLORS.steelLight },
    { y: 14, xStart: 13, xEnd: 18, color: KNIGHT_COLORS.goldLight },
    { y: 14, xStart: 19, xEnd: 20, color: KNIGHT_COLORS.steelDark },
    { y: 14, xStart: 21, xEnd: 24, color: KNIGHT_COLORS.steelDark },
    { y: 15, xStart: 5, xEnd: 8, color: KNIGHT_COLORS.goldMid },
    { y: 15, xStart: 9, xEnd: 10, color: KNIGHT_COLORS.outline },
    { y: 15, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.steelLight },
    { y: 15, xStart: 15, xEnd: 16, color: KNIGHT_COLORS.goldLight },
    { y: 15, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.steelDark },
    { y: 15, xStart: 21, xEnd: 23, color: KNIGHT_COLORS.outline },
    { y: 16, xStart: 5, xEnd: 5, color: KNIGHT_COLORS.goldMid },
    { y: 16, xStart: 6, xEnd: 7, color: KNIGHT_COLORS.crimsonMid },
    { y: 16, xStart: 8, xEnd: 8, color: KNIGHT_COLORS.goldMid },
    { y: 16, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.steelMid },
    { y: 16, xStart: 15, xEnd: 16, color: KNIGHT_COLORS.steelMid },
    { y: 16, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.steelDark },
    { y: 16, xStart: 23, xEnd: 24, color: KNIGHT_COLORS.goldLight },
    { y: 17, xStart: 5, xEnd: 5, color: KNIGHT_COLORS.goldMid },
    { y: 17, xStart: 6, xEnd: 7, color: KNIGHT_COLORS.crimsonMid },
    { y: 17, xStart: 8, xEnd: 8, color: KNIGHT_COLORS.goldMid },
    { y: 17, xStart: 11, xEnd: 14, color: KNIGHT_COLORS.leatherMid },
    { y: 17, xStart: 15, xEnd: 16, color: KNIGHT_COLORS.goldLight },
    { y: 17, xStart: 17, xEnd: 20, color: KNIGHT_COLORS.leatherDark },
    { y: 17, xStart: 23, xEnd: 24, color: KNIGHT_COLORS.leatherDark },
    { y: 18, xStart: 5, xEnd: 5, color: KNIGHT_COLORS.goldMid },
    { y: 18, xStart: 6, xEnd: 7, color: KNIGHT_COLORS.crimsonMid },
    { y: 18, xStart: 8, xEnd: 8, color: KNIGHT_COLORS.goldMid },
    { y: 18, xStart: 11, xEnd: 20, color: KNIGHT_COLORS.tunicMid },
    { y: 18, xStart: 23, xEnd: 24, color: KNIGHT_COLORS.leatherDark },
    { y: 19, xStart: 6, xEnd: 7, color: KNIGHT_COLORS.crimsonDark },
    { y: 19, xStart: 8, xEnd: 8, color: KNIGHT_COLORS.goldMid },
    { y: 19, xStart: 10, xEnd: 21, color: KNIGHT_COLORS.tunicDark },
    { y: 19, xStart: 23, xEnd: 24, color: KNIGHT_COLORS.goldMid },
    { y: 20, xStart: 6, xEnd: 7, color: KNIGHT_COLORS.outline },
    { y: 20, xStart: 11, xEnd: 20, color: KNIGHT_COLORS.outline }
  ];
}

export function getKnightHelmetRunsDown(): PixelRun[] {
  return [
    { y: 1, xStart: 15, xEnd: 17, color: KNIGHT_COLORS.crimsonLight },
    { y: 2, xStart: 14, xEnd: 18, color: KNIGHT_COLORS.crimsonLight },
    { y: 3, xStart: 14, xEnd: 18, color: KNIGHT_COLORS.crimsonMid },
    { y: 4, xStart: 12, xEnd: 19, color: KNIGHT_COLORS.steelLight },
    { y: 5, xStart: 10, xEnd: 12, color: KNIGHT_COLORS.steelLight },
    { y: 5, xStart: 13, xEnd: 15, color: KNIGHT_COLORS.steelWhite },
    { y: 5, xStart: 16, xEnd: 18, color: KNIGHT_COLORS.steelMid },
    { y: 5, xStart: 19, xEnd: 21, color: KNIGHT_COLORS.steelDark },
    { y: 6, xStart: 10, xEnd: 11, color: KNIGHT_COLORS.steelLight },
    { y: 6, xStart: 12, xEnd: 14, color: KNIGHT_COLORS.steelWhite },
    { y: 6, xStart: 15, xEnd: 18, color: KNIGHT_COLORS.steelMid },
    { y: 6, xStart: 19, xEnd: 21, color: KNIGHT_COLORS.steelDark },
    { y: 7, xStart: 10, xEnd: 12, color: KNIGHT_COLORS.goldMid },
    { y: 7, xStart: 13, xEnd: 16, color: KNIGHT_COLORS.goldLight },
    { y: 7, xStart: 17, xEnd: 21, color: KNIGHT_COLORS.goldDark },
    { y: 8, xStart: 10, xEnd: 12, color: KNIGHT_COLORS.outline },
    { y: 8, xStart: 13, xEnd: 13, color: KNIGHT_COLORS.steelWhite },
    { y: 8, xStart: 14, xEnd: 17, color: KNIGHT_COLORS.outline },
    { y: 8, xStart: 18, xEnd: 18, color: KNIGHT_COLORS.steelWhite },
    { y: 8, xStart: 19, xEnd: 21, color: KNIGHT_COLORS.outline },
    { y: 9, xStart: 10, xEnd: 12, color: KNIGHT_COLORS.outline },
    { y: 9, xStart: 13, xEnd: 13, color: KNIGHT_COLORS.steelWhite },
    { y: 9, xStart: 14, xEnd: 17, color: KNIGHT_COLORS.outline },
    { y: 9, xStart: 18, xEnd: 18, color: KNIGHT_COLORS.steelWhite },
    { y: 9, xStart: 19, xEnd: 21, color: KNIGHT_COLORS.outline },
    { y: 10, xStart: 11, xEnd: 15, color: KNIGHT_COLORS.steelMid },
    { y: 10, xStart: 16, xEnd: 20, color: KNIGHT_COLORS.steelDark },
    { y: 11, xStart: 12, xEnd: 19, color: KNIGHT_COLORS.outline }
  ];
}
