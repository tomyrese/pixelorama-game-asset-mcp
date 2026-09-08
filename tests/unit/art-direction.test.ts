import { describe, it, expect } from "vitest";
import { resolveArtDirection, BUILTIN_ART_PRESETS } from "@pixelorama/art-direction";

describe("ArtDirection", () => {
  it("resolves default preset correctly", () => {
    const art = resolveArtDirection("cozy_farm_32");
    expect(art.genre).toBe("Farming RPG");
    expect(art.baseTileSize).toBe(32);
    expect(art.palette.length).toBeGreaterThan(5);
  });

  it("contains all required built-in art presets", () => {
    const expectedPresets = [
      "cozy_farm_16",
      "cozy_farm_32",
      "topdown_rpg",
      "side_scroll_fantasy",
      "retro_8bit",
      "retro_16bit",
      "dark_fantasy",
      "bright_adventure",
      "minimal_pixel_ui"
    ];

    for (const name of expectedPresets) {
      expect(BUILTIN_ART_PRESETS[name]).toBeDefined();
    }
  });

  it("applies overrides properly", () => {
    const custom = resolveArtDirection("cozy_farm_32", {
      project: "Custom Farm",
      characterScale: 48
    });
    expect(custom.project).toBe("Custom Farm");
    expect(custom.characterScale).toBe(48);
  });
});
