import { AssetSpec, LayerSpec, AnimationSpec } from "./types.js";

export function createCharacterSpec(params: {
  id: string;
  name: string;
  width?: number;
  height?: number;
  animations?: string[];
  directions?: Array<"down" | "left" | "right" | "up">;
}): AssetSpec {
  const width = params.width ?? 32;
  const height = params.height ?? 32;
  const directions = params.directions ?? ["down"];
  const animNames = params.animations ?? ["idle", "walk"];

  const layers: LayerSpec[] = [
    { name: "shadow", type: "pixel", opacity: 0.6, visible: true },
    { name: "body", type: "pixel", opacity: 1, visible: true },
    { name: "clothing", type: "pixel", opacity: 1, visible: true },
    { name: "hair", type: "pixel", opacity: 1, visible: true }
  ];

  const animations: AnimationSpec[] = [];
  let currentFrame = 0;

  for (const animName of animNames) {
    if (["harvest", "mine", "chop", "attack", "skill", "interact"].includes(animName)) {
      const frameCount = animName === "interact" ? 4 : 6;
      animations.push({
        name: animName,
        direction: "down",
        startFrame: currentFrame,
        frameCount,
        fps: 8,
        loop: false,
        events: []
      });
      currentFrame += frameCount;
    } else {
      for (const dir of directions) {
        const frameCount = animName === "idle" ? 4 : 6;
        animations.push({
          name: `${animName}_${dir}`,
          direction: dir,
          startFrame: currentFrame,
          frameCount,
          fps: animName === "idle" ? 6 : 8,
          loop: true,
          events: []
        });
        currentFrame += frameCount;
      }
    }
  }

  return {
    id: params.id,
    name: params.name,
    type: "character",
    purpose: "player_character",
    width,
    height,
    layers,
    animations,
    anchor: { x: 0.5, y: 1.0 },
    pivot: { x: Math.floor(width / 2), y: height },
    validationRules: {
      allowSemiTransparency: false,
      requireTransparentBackground: true,
      detectFakeAnimation: true,
      checkTilesetSeams: false,
      checkNineSlice: false
    }
  };
}

export function createItemSpec(params: {
  id: string;
  name: string;
  width?: number;
  height?: number;
}): AssetSpec {
  const width = params.width ?? 32;
  const height = params.height ?? 32;

  return {
    id: params.id,
    name: params.name,
    type: "item",
    purpose: "inventory_icon",
    width,
    height,
    layers: [
      { name: "base", type: "pixel", opacity: 1, visible: true },
      { name: "highlight", type: "pixel", opacity: 1, visible: true }
    ],
    animations: [
      {
        name: "static",
        direction: "single",
        startFrame: 0,
        frameCount: 1,
        fps: 1,
        loop: false,
        events: []
      }
    ],
    anchor: { x: 0.5, y: 0.5 },
    pivot: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
    validationRules: {
      allowSemiTransparency: false,
      requireTransparentBackground: true,
      detectFakeAnimation: false,
      checkTilesetSeams: false,
      checkNineSlice: false
    }
  };
}

export function createTilesetSpec(params: {
  id: string;
  name: string;
  tileSize?: number;
  columns?: number;
  rows?: number;
}): AssetSpec {
  const tileSize = params.tileSize ?? 32;
  const cols = params.columns ?? 4;
  const rows = params.rows ?? 4;
  const width = tileSize * cols;
  const height = tileSize * rows;

  return {
    id: params.id,
    name: params.name,
    type: "tileset",
    purpose: "terrain_tileset",
    width,
    height,
    layers: [
      { name: "terrain_base", type: "pixel", opacity: 1, visible: true },
      { name: "terrain_detail", type: "pixel", opacity: 1, visible: true }
    ],
    animations: [],
    anchor: { x: 0, y: 0 },
    pivot: { x: 0, y: 0 },
    validationRules: {
      allowSemiTransparency: false,
      requireTransparentBackground: true,
      detectFakeAnimation: false,
      checkTilesetSeams: true,
      checkNineSlice: false
    }
  };
}
