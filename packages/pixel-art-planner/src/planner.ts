import { AssetSpec } from "@pixelorama/asset-spec";
import { ArtDirectionSpec } from "@pixelorama/art-direction";
import { PixelRun } from "@pixelorama/shared";
import { PixelArtPlan, StageDrawingBatch } from "./types.js";
import { generateGroundShadowRuns, runsToPixelTuples } from "./silhouette.js";

import {
  getKnightGroundShadowRuns,
  getKnightBodyRunsDown,
  getKnightClothingRunsDown,
  getKnightHelmetRunsDown,
  KNIGHT_COLORS
} from "./knight.js";

export function planPixelArt(
  spec: AssetSpec,
  artDirection: ArtDirectionSpec
): PixelArtPlan {
  const width = spec.width;
  const height = spec.height;
  const palette = artDirection.palette;

  const colorMap = {
    shadow: palette.find((p) => p.role === "shadow")?.hex ?? "#2b1c18",
    outline: palette.find((p) => p.role === "outline")?.hex ?? "#2b1c18",
    skinBase: palette.find((p) => p.role === "skin" && p.name.includes("Mid"))?.hex ?? "#e8a987",
    skinShadow: palette.find((p) => p.role === "skin" && p.name.includes("Dark"))?.hex ?? "#c98263",
    skinLight: palette.find((p) => p.role === "skin" && p.name.includes("Light"))?.hex ?? "#fad2b8",
    clothBase: palette.find((p) => p.role === "clothing" && p.name.includes("Mid"))?.hex ?? "#3e5d7d",
    clothShadow: palette.find((p) => p.role === "clothing" && p.name.includes("Dark"))?.hex ?? "#233852",
    clothLight: palette.find((p) => p.role === "clothing" && p.name.includes("Light"))?.hex ?? "#6389a8",
    hairBase: palette.find((p) => p.role === "base")?.hex ?? "#7a4932",
    accent: palette.find((p) => p.role === "accent")?.hex ?? "#e0a867",
    white: "#f7f1e6"
  };

  const stages: StageDrawingBatch[] = [];
  const layers = spec.layers.map((l) => l.name);

  const isKnight = spec.id.includes("knight") || spec.name.toLowerCase().includes("knight");

  if (spec.type === "character" || spec.type === "npc" || spec.type === "enemy") {
    const shadowRuns = isKnight
      ? getKnightGroundShadowRuns()
      : generateGroundShadowRuns(
          Math.floor(width / 2),
          height - 3,
          Math.floor(width * 0.22),
          2,
          colorMap.shadow
        );

    stages.push({
      stage: "shadow",
      layerIndex: 0,
      layerName: "shadow",
      frameIndex: 0,
      runs: shadowRuns,
      pixels: runsToPixelTuples(shadowRuns),
      cursorPosition: { x: Math.floor(width / 2), y: height - 3 },
      tool: "Pencil",
      primaryColor: colorMap.shadow
    });

    const bodyRuns: PixelRun[] = isKnight
      ? getKnightBodyRunsDown()
      : [
          { y: 8, xStart: 12, xEnd: 19, color: colorMap.skinBase },
          { y: 9, xStart: 11, xEnd: 20, color: colorMap.skinBase },
          { y: 10, xStart: 11, xEnd: 20, color: colorMap.skinBase },
          { y: 11, xStart: 12, xEnd: 19, color: colorMap.skinBase },
          { y: 12, xStart: 13, xEnd: 18, color: colorMap.skinShadow },
          { y: 17, xStart: 9, xEnd: 11, color: colorMap.skinBase },
          { y: 18, xStart: 9, xEnd: 11, color: colorMap.skinBase },
          { y: 17, xStart: 20, xEnd: 22, color: colorMap.skinBase },
          { y: 18, xStart: 20, xEnd: 22, color: colorMap.skinBase }
        ];

    stages.push({
      stage: "base_color",
      layerIndex: 1,
      layerName: "body",
      frameIndex: 0,
      runs: bodyRuns,
      pixels: runsToPixelTuples(bodyRuns),
      cursorPosition: { x: 15, y: 10 },
      tool: "Pencil",
      primaryColor: isKnight ? KNIGHT_COLORS.steelMid : colorMap.skinBase
    });

    const clothingRuns: PixelRun[] = isKnight
      ? getKnightClothingRunsDown()
      : [
          { y: 13, xStart: 12, xEnd: 19, color: colorMap.clothLight },
          { y: 14, xStart: 11, xEnd: 20, color: colorMap.clothBase },
          { y: 15, xStart: 11, xEnd: 20, color: colorMap.clothBase },
          { y: 16, xStart: 12, xEnd: 19, color: colorMap.clothBase },
          { y: 17, xStart: 12, xEnd: 19, color: colorMap.clothShadow },
          { y: 18, xStart: 12, xEnd: 19, color: colorMap.clothBase },
          { y: 19, xStart: 12, xEnd: 19, color: colorMap.clothBase },
          { y: 20, xStart: 12, xEnd: 19, color: colorMap.clothBase },
          { y: 21, xStart: 12, xEnd: 19, color: colorMap.clothBase },
          { y: 22, xStart: 12, xEnd: 19, color: colorMap.clothShadow },
          { y: 23, xStart: 12, xEnd: 15, color: colorMap.clothBase },
          { y: 23, xStart: 16, xEnd: 19, color: colorMap.clothShadow },
          { y: 24, xStart: 12, xEnd: 15, color: colorMap.clothBase },
          { y: 24, xStart: 16, xEnd: 19, color: colorMap.clothShadow },
          { y: 25, xStart: 12, xEnd: 15, color: colorMap.clothBase },
          { y: 25, xStart: 16, xEnd: 19, color: colorMap.clothShadow },
          { y: 26, xStart: 11, xEnd: 15, color: colorMap.outline },
          { y: 26, xStart: 16, xEnd: 20, color: colorMap.outline },
          { y: 27, xStart: 11, xEnd: 15, color: colorMap.outline },
          { y: 27, xStart: 16, xEnd: 20, color: colorMap.outline }
        ];

    stages.push({
      stage: "shading",
      layerIndex: 2,
      layerName: "clothing",
      frameIndex: 0,
      runs: clothingRuns,
      pixels: runsToPixelTuples(clothingRuns),
      cursorPosition: { x: 15, y: 18 },
      tool: "Pencil",
      primaryColor: isKnight ? KNIGHT_COLORS.goldLight : colorMap.clothBase
    });

    const hairHatRuns: PixelRun[] = isKnight
      ? getKnightHelmetRunsDown()
      : [
          { y: 3, xStart: 13, xEnd: 18, color: colorMap.accent },
          { y: 4, xStart: 12, xEnd: 19, color: colorMap.accent },
          { y: 5, xStart: 12, xEnd: 19, color: colorMap.hairBase },
          { y: 6, xStart: 8, xEnd: 23, color: colorMap.accent },
          { y: 7, xStart: 7, xEnd: 24, color: colorMap.accent },
          { y: 8, xStart: 10, xEnd: 12, color: colorMap.hairBase },
          { y: 8, xStart: 19, xEnd: 21, color: colorMap.hairBase },
          { y: 9, xStart: 10, xEnd: 11, color: colorMap.hairBase },
          { y: 9, xStart: 20, xEnd: 21, color: colorMap.hairBase }
        ];

    stages.push({
      stage: "detail",
      layerIndex: 3,
      layerName: "hair",
      frameIndex: 0,
      runs: hairHatRuns,
      pixels: runsToPixelTuples(hairHatRuns),
      cursorPosition: { x: 15, y: 6 },
      tool: "Pencil",
      primaryColor: isKnight ? KNIGHT_COLORS.crimsonMid : colorMap.accent
    });
  } else {
    const itemRuns: PixelRun[] = [
      { y: Math.floor(height / 2) - 2, xStart: Math.floor(width / 2) - 6, xEnd: Math.floor(width / 2) + 6, color: colorMap.clothBase },
      { y: Math.floor(height / 2) - 1, xStart: Math.floor(width / 2) - 6, xEnd: Math.floor(width / 2) + 6, color: colorMap.clothLight },
      { y: Math.floor(height / 2), xStart: Math.floor(width / 2) - 6, xEnd: Math.floor(width / 2) + 6, color: colorMap.accent },
      { y: Math.floor(height / 2) + 1, xStart: Math.floor(width / 2) - 6, xEnd: Math.floor(width / 2) + 6, color: colorMap.clothShadow }
    ];

    stages.push({
      stage: "base_color",
      layerIndex: 0,
      layerName: spec.layers[0]?.name ?? "base",
      frameIndex: 0,
      runs: itemRuns,
      pixels: runsToPixelTuples(itemRuns),
      cursorPosition: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
      tool: "Pencil",
      primaryColor: colorMap.accent
    });
  }

  return {
    assetId: spec.id,
    width,
    height,
    palette,
    layers,
    stages
  };
}
