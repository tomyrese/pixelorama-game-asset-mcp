import { describe, it, expect } from "vitest";
import {
  createCharacterSpec,
  createItemSpec,
  createTilesetSpec,
  AssetSpecSchema
} from "@pixelorama/asset-spec";

describe("AssetSpec", () => {
  it("builds a valid character spec", () => {
    const spec = createCharacterSpec({
      id: "player_farmer",
      name: "Player Farmer",
      width: 32,
      height: 32,
      animations: ["idle", "walk"],
      directions: ["down"]
    });

    const parsed = AssetSpecSchema.safeParse(spec);
    expect(parsed.success).toBe(true);
    expect(spec.layers.length).toBe(4);
    expect(spec.animations.length).toBe(2);
    expect(spec.animations[0].name).toBe("idle_down");
    expect(spec.animations[1].name).toBe("walk_down");
  });

  it("builds a valid item spec", () => {
    const spec = createItemSpec({
      id: "iron_sword",
      name: "Iron Sword",
      width: 16,
      height: 16
    });

    const parsed = AssetSpecSchema.safeParse(spec);
    expect(parsed.success).toBe(true);
    expect(spec.type).toBe("item");
    expect(spec.width).toBe(16);
  });

  it("builds a valid tileset spec", () => {
    const spec = createTilesetSpec({
      id: "village_terrain",
      name: "Village Terrain",
      tileSize: 32,
      columns: 4,
      rows: 4
    });

    const parsed = AssetSpecSchema.safeParse(spec);
    expect(parsed.success).toBe(true);
    expect(spec.width).toBe(128);
    expect(spec.height).toBe(128);
  });
});
