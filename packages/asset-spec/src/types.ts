import { z } from "zod";

export const AnimationDirectionSchema = z.enum([
  "down",
  "left",
  "right",
  "up",
  "down_left",
  "down_right",
  "up_left",
  "up_right",
  "single"
]);

export const AnimationEventSchema = z.object({
  frame: z.number().int().min(0),
  name: z.string(),
  payload: z.record(z.unknown()).optional()
});

export const AnimationSpecSchema = z.object({
  name: z.string(),
  direction: AnimationDirectionSchema.default("single"),
  startFrame: z.number().int().min(0).default(0),
  frameCount: z.number().int().positive().default(1),
  fps: z.number().positive().default(8),
  loop: z.boolean().default(true),
  events: z.array(AnimationEventSchema).default([])
});

export const LayerSpecSchema = z.object({
  name: z.string(),
  type: z.enum(["pixel", "group", "3d", "tilemap"]).default("pixel"),
  opacity: z.number().min(0).max(1).default(1),
  visible: z.boolean().default(true)
});

export const ValidationRulesSchema = z.object({
  allowSemiTransparency: z.boolean().default(false),
  requireTransparentBackground: z.boolean().default(true),
  detectFakeAnimation: z.boolean().default(true),
  checkTilesetSeams: z.boolean().default(false),
  checkNineSlice: z.boolean().default(false),
  maxColors: z.number().int().positive().optional()
});

export const AssetSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    "character",
    "npc",
    "enemy",
    "boss",
    "item",
    "weapon",
    "armor",
    "tool",
    "building",
    "prop",
    "tileset",
    "background",
    "ui",
    "vfx"
  ]),
  purpose: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  layers: z.array(LayerSpecSchema),
  animations: z.array(AnimationSpecSchema).default([]),
  anchor: z.object({ x: z.number(), y: z.number() }).default({ x: 0.5, y: 1.0 }),
  pivot: z.object({ x: z.number(), y: z.number() }).default({ x: 16, y: 32 }),
  validationRules: ValidationRulesSchema.default({
    allowSemiTransparency: false,
    requireTransparentBackground: true,
    detectFakeAnimation: true,
    checkTilesetSeams: false,
    checkNineSlice: false
  })
});

export type AssetSpec = z.infer<typeof AssetSpecSchema>;
export type AnimationSpec = z.infer<typeof AnimationSpecSchema>;
export type LayerSpec = z.infer<typeof LayerSpecSchema>;
export type ValidationRules = z.infer<typeof ValidationRulesSchema>;
