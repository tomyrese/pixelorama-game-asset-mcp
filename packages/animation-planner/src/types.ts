import { PixelRun, PixelTuple } from "@pixelorama/shared";

export type KeyframePoseType = "contact" | "down" | "passing" | "up" | "anticipation" | "active" | "recovery" | "action";

export interface LayerFrameDelta {
  layerIndex: number;
  layerName: string;
  runs: PixelRun[];
  pixels: PixelTuple[];
}

export interface AnimationKeyframe {
  frameIndex: number;
  poseType: KeyframePoseType;
  duration: number;
  layerUpdates: LayerFrameDelta[];
  cursorTarget: { x: number; y: number };
}

export interface AnimationSequencePlan {
  tag: string;
  direction: string;
  startFrame: number;
  frameCount: number;
  fps: number;
  keyframes: AnimationKeyframe[];
}
