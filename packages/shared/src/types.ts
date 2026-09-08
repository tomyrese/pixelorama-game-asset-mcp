export type AssetType =
  | "character"
  | "npc"
  | "enemy"
  | "boss"
  | "pet"
  | "mount"
  | "item"
  | "weapon"
  | "armor"
  | "tool"
  | "building"
  | "prop"
  | "tileset"
  | "background"
  | "ui"
  | "vfx";

export type QualityState =
  | "PLANNED"
  | "DRAWING"
  | "ANIMATING"
  | "VALIDATING"
  | "FIXING"
  | "PASS"
  | "FAIL"
  | "BLOCKED";

export type DrawingMode = "live" | "fast" | "instant";

export interface Dimensions {
  width: number;
  height: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Rect2D {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type PixelTuple = [number, number, number, number, number, number];

export interface PixelRun {
  y: number;
  xStart: number;
  xEnd: number;
  color: string;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}
