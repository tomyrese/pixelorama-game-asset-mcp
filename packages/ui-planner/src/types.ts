import { PixelRun } from "@pixelorama/shared";

export type UIComponentType =
  | "panel"
  | "button"
  | "item_slot"
  | "bar"
  | "tooltip"
  | "dialog";

export type UIState = "normal" | "hover" | "pressed" | "disabled" | "selected" | "locked";

export interface NineSliceMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface UIComponentPlan {
  name: string;
  type: UIComponentType;
  state: UIState;
  width: number;
  height: number;
  nineSlice?: NineSliceMargins;
  runs: PixelRun[];
}
