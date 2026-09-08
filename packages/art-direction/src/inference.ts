import { ArtDirectionSpec } from "./types.js";
import { BUILTIN_ART_PRESETS } from "./presets.js";

export function resolveArtDirection(
  presetName?: string,
  overrides?: Partial<ArtDirectionSpec>
): ArtDirectionSpec {
  const base = (presetName && BUILTIN_ART_PRESETS[presetName])
    ? BUILTIN_ART_PRESETS[presetName]
    : BUILTIN_ART_PRESETS["cozy_farm_32"];

  if (!overrides) {
    return { ...base };
  }

  return {
    ...base,
    ...overrides,
    palette: overrides.palette ?? base.palette,
    forbiddenPatterns: overrides.forbiddenPatterns ?? base.forbiddenPatterns
  };
}

export function findMatchingColor(
  palette: Array<{ hex: string; role?: string }>,
  targetRole: string,
  fallbackHex: string
): string {
  const match = palette.find((p) => p.role === targetRole);
  return match ? match.hex : fallbackHex;
}
