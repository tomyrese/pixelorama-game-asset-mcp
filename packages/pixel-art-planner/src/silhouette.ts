import { PixelTuple, PixelRun, hexToRgba } from "@pixelorama/shared";

export function runsToPixelTuples(runs: PixelRun[]): PixelTuple[] {
  const tuples: PixelTuple[] = [];
  for (const run of runs) {
    const rgba = hexToRgba(run.color);
    for (let x = run.xStart; x <= run.xEnd; x++) {
      tuples.push([
        x,
        run.y,
        rgba.r,
        rgba.g,
        rgba.b,
        Math.round(rgba.a * 255)
      ]);
    }
  }
  return tuples;
}

export function generateGroundShadowRuns(
  centerX: number,
  groundY: number,
  radiusX: number,
  radiusY: number,
  color: string
): PixelRun[] {
  const runs: PixelRun[] = [];
  for (let dy = -radiusY; dy <= radiusY; dy++) {
    const y = groundY + dy;
    const factor = Math.sqrt(1 - (dy * dy) / (radiusY * radiusY));
    const spanX = Math.round(radiusX * factor);
    if (spanX > 0) {
      runs.push({
        y,
        xStart: centerX - spanX,
        xEnd: centerX + spanX,
        color
      });
    }
  }
  return runs;
}
