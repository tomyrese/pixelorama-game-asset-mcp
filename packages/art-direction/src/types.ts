import { z } from "zod";

export const OutlineStyleSchema = z.enum(["none", "black", "dark_colored", "selective"]);
export const LightingDirectionSchema = z.enum(["top_left", "top", "top_right", "front"]);
export const CameraPerspectiveSchema = z.enum(["top_down", "side_scroller", "isometric", "three_quarters"]);

export const PaletteColorSchema = z.object({
  name: z.string(),
  hex: z.string(),
  role: z.enum(["outline", "base", "shadow", "highlight", "accent", "skin", "hair", "clothing"]).optional()
});

export const ArtDirectionSpecSchema = z.object({
  project: z.string(),
  genre: z.string(),
  camera: CameraPerspectiveSchema,
  baseTileSize: z.number().int().positive(),
  characterScale: z.number().int().positive(),
  outlineStyle: OutlineStyleSchema,
  palettePolicy: z.enum(["strict_palette", "ramp_extended", "free_harmonized"]),
  lightingDirection: LightingDirectionSchema,
  shadowPolicy: z.enum(["cool_purple", "warm_brown", "desaturated_dark", "direct_tone"]),
  saturation: z.enum(["muted", "balanced", "vibrant", "neon"]),
  contrast: z.enum(["low", "medium", "high"]),
  detailDensity: z.enum(["minimalist", "readable_cluster", "high_detail"]),
  animationStyle: z.enum(["snappy_chibi", "fluid_smooth", "retro_limited", "bouncy_action"]),
  uiStyle: z.string(),
  backgroundStyle: z.string(),
  palette: z.array(PaletteColorSchema),
  forbiddenPatterns: z.array(z.string()).default([])
});

export type ArtDirectionSpec = z.infer<typeof ArtDirectionSpecSchema>;
export type PaletteColor = z.infer<typeof PaletteColorSchema>;
