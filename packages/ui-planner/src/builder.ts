import { PixelRun } from "@pixelorama/shared";
import { UIComponentPlan, UIState } from "./types.js";

export function planNineSlicePanel(
  name: string,
  width: number,
  height: number,
  colors: { outline: string; bevelLight: string; bevelDark: string; bg: string }
): UIComponentPlan {
  const runs: PixelRun[] = [];

  runs.push({ y: 0, xStart: 1, xEnd: width - 2, color: colors.outline });
  runs.push({ y: height - 1, xStart: 1, xEnd: width - 2, color: colors.outline });

  for (let y = 1; y < height - 1; y++) {
    runs.push({ y, xStart: 0, xEnd: 0, color: colors.outline });
    runs.push({ y, xStart: width - 1, xEnd: width - 1, color: colors.outline });

    if (y === 1) {
      runs.push({ y, xStart: 1, xEnd: width - 2, color: colors.bevelLight });
    } else if (y === height - 2) {
      runs.push({ y, xStart: 1, xEnd: width - 2, color: colors.bevelDark });
    } else {
      runs.push({ y, xStart: 1, xEnd: 1, color: colors.bevelLight });
      runs.push({ y, xStart: 2, xEnd: width - 3, color: colors.bg });
      runs.push({ y, xStart: width - 2, xEnd: width - 2, color: colors.bevelDark });
    }
  }

  return {
    name,
    type: "panel",
    state: "normal",
    width,
    height,
    nineSlice: { top: 3, bottom: 3, left: 3, right: 3 },
    runs
  };
}

export function planButtonState(
  name: string,
  state: UIState,
  width: number,
  height: number,
  palette: { outline: string; base: string; highlight: string; shadow: string }
): UIComponentPlan {
  const isPressed = state === "pressed";
  const light = isPressed ? palette.shadow : palette.highlight;
  const dark = isPressed ? palette.highlight : palette.shadow;

  const runs: PixelRun[] = [];
  runs.push({ y: 0, xStart: 1, xEnd: width - 2, color: palette.outline });
  runs.push({ y: height - 1, xStart: 1, xEnd: width - 2, color: palette.outline });

  for (let y = 1; y < height - 1; y++) {
    runs.push({ y, xStart: 0, xEnd: 0, color: palette.outline });
    runs.push({ y, xStart: width - 1, xEnd: width - 1, color: palette.outline });

    if (y === 1) {
      runs.push({ y, xStart: 1, xEnd: width - 2, color: light });
    } else if (y === height - 2) {
      runs.push({ y, xStart: 1, xEnd: width - 2, color: dark });
    } else {
      runs.push({ y, xStart: 1, xEnd: 1, color: light });
      runs.push({ y, xStart: 2, xEnd: width - 3, color: palette.base });
      runs.push({ y, xStart: width - 2, xEnd: width - 2, color: dark });
    }
  }

  return {
    name: `${name}_${state}`,
    type: "button",
    state,
    width,
    height,
    nineSlice: { top: 2, bottom: 2, left: 2, right: 2 },
    runs
  };
}
