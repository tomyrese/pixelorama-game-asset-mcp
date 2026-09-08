import { z } from "zod";

export const DrawingModeSchema = z.enum(["live", "fast", "instant"]);

export const Point2DSchema = z.object({
  x: z.number().int(),
  y: z.number().int()
});

export const Rect2DSchema = z.object({
  x: z.number().int(),
  y: z.number().int(),
  width: z.number().int().positive(),
  height: z.number().int().positive()
});

export const PixelTupleSchema = z.tuple([
  z.number().int(),
  z.number().int(),
  z.number().min(0).max(255),
  z.number().min(0).max(255),
  z.number().min(0).max(255),
  z.number().min(0).max(255)
]);

export const PixelRunSchema = z.object({
  y: z.number().int(),
  xStart: z.number().int(),
  xEnd: z.number().int(),
  color: z.string()
});

export const BridgeCommandSchema = z.discriminatedUnion("command", [
  z.object({
    command: z.literal("status")
  }),
  z.object({
    command: z.literal("project.create"),
    name: z.string().default("untitled"),
    width: z.number().int().positive().default(64),
    height: z.number().int().positive().default(64),
    fillColor: z.string().default("#00000000")
  }),
  z.object({
    command: z.literal("project.open"),
    path: z.string()
  }),
  z.object({
    command: z.literal("project.save"),
    path: z.string()
  }),
  z.object({
    command: z.literal("project.inspect"),
    projectIndex: z.number().int().optional()
  }),
  z.object({
    command: z.literal("project.close"),
    projectIndex: z.number().int().optional()
  }),
  z.object({
    command: z.literal("canvas.inspect")
  }),
  z.object({
    command: z.literal("canvas.resize"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    offsetX: z.number().int().default(0),
    offsetY: z.number().int().default(0)
  }),
  z.object({
    command: z.literal("canvas.snapshot"),
    frameIndex: z.number().int().optional(),
    layerIndex: z.number().int().optional()
  }),
  z.object({
    command: z.literal("layer.list")
  }),
  z.object({
    command: z.literal("layer.create"),
    name: z.string(),
    aboveLayer: z.number().int().default(0),
    layerType: z.number().int().default(0)
  }),
  z.object({
    command: z.literal("layer.rename"),
    layerIndex: z.number().int(),
    name: z.string()
  }),
  z.object({
    command: z.literal("layer.select"),
    layerIndex: z.number().int()
  }),
  z.object({
    command: z.literal("layer.visibility"),
    layerIndex: z.number().int(),
    visible: z.boolean()
  }),
  z.object({
    command: z.literal("layer.opacity"),
    layerIndex: z.number().int(),
    opacity: z.number().min(0).max(1)
  }),
  z.object({
    command: z.literal("layer.delete"),
    layerIndex: z.number().int()
  }),
  z.object({
    command: z.literal("frame.list")
  }),
  z.object({
    command: z.literal("frame.create"),
    afterFrame: z.number().int().default(0)
  }),
  z.object({
    command: z.literal("frame.select"),
    frameIndex: z.number().int()
  }),
  z.object({
    command: z.literal("frame.duration"),
    frameIndex: z.number().int(),
    duration: z.number().positive()
  }),
  z.object({
    command: z.literal("frame.delete"),
    frameIndex: z.number().int()
  }),
  z.object({
    command: z.literal("draw.pixels"),
    pixels: z.array(PixelTupleSchema),
    mode: DrawingModeSchema.default("live")
  }),
  z.object({
    command: z.literal("draw.pixel_runs"),
    runs: z.array(PixelRunSchema),
    mode: DrawingModeSchema.default("live")
  }),
  z.object({
    command: z.literal("draw.rect"),
    rect: Rect2DSchema,
    color: z.string(),
    filled: z.boolean().default(true),
    mode: DrawingModeSchema.default("live")
  }),
  z.object({
    command: z.literal("draw.line"),
    start: Point2DSchema,
    end: Point2DSchema,
    color: z.string(),
    thickness: z.number().int().positive().default(1),
    mode: DrawingModeSchema.default("live")
  }),
  z.object({
    command: z.literal("draw.ellipse"),
    rect: Rect2DSchema,
    color: z.string(),
    filled: z.boolean().default(true),
    mode: DrawingModeSchema.default("live")
  }),
  z.object({
    command: z.literal("draw.fill"),
    point: Point2DSchema,
    color: z.string(),
    mode: DrawingModeSchema.default("live")
  }),
  z.object({
    command: z.literal("draw.erase"),
    pixels: z.array(Point2DSchema),
    mode: DrawingModeSchema.default("live")
  }),
  z.object({
    command: z.literal("palette.inspect")
  }),
  z.object({
    command: z.literal("palette.create"),
    name: z.string(),
    colors: z.array(z.string()),
    isGlobal: z.boolean().default(false)
  }),
  z.object({
    command: z.literal("palette.select_color"),
    color: z.string(),
    button: z.number().int().default(1)
  }),
  z.object({
    command: z.literal("animation.inspect")
  }),
  z.object({
    command: z.literal("animation.create_tag"),
    name: z.string(),
    fromFrame: z.number().int(),
    toFrame: z.number().int(),
    color: z.string().default("#00aa00")
  }),
  z.object({
    command: z.literal("animation.play"),
    forward: z.boolean().default(true)
  }),
  z.object({
    command: z.literal("animation.stop")
  }),
  z.object({
    command: z.literal("cursor.set"),
    x: z.number().int(),
    y: z.number().int(),
    tool: z.string().default("Pencil"),
    color: z.string().default("#000000"),
    stage: z.string().default("Drawing"),
    message: z.string().optional()
  }),
  z.object({
    command: z.literal("cursor.visibility"),
    visible: z.boolean()
  }),
  z.object({
    command: z.literal("export.png"),
    path: z.string()
  }),
  z.object({
    command: z.literal("export.spritesheet"),
    path: z.string(),
    columns: z.number().int().positive().optional(),
    rows: z.number().int().positive().optional()
  }),
  z.object({
    command: z.literal("history.undo")
  }),
  z.object({
    command: z.literal("history.redo")
  }),
  z.object({
    command: z.literal("history.checkpoint"),
    name: z.string()
  })
]);

export type BridgeCommand = z.infer<typeof BridgeCommandSchema>;

export const BridgeRequestSchema = z.object({
  id: z.string(),
  command: BridgeCommandSchema
});

export type BridgeRequest = z.infer<typeof BridgeRequestSchema>;

export const BridgeResponseSchema = z.object({
  id: z.string(),
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional()
    })
    .optional()
});

export type BridgeResponse = z.infer<typeof BridgeResponseSchema>;

export const BridgeEventSchema = z.discriminatedUnion("event", [
  z.object({
    event: z.literal("operation.progress"),
    operationId: z.string(),
    current: z.number(),
    total: z.number(),
    stage: z.string(),
    message: z.string().optional()
  }),
  z.object({
    event: z.literal("project.changed"),
    projectIndex: z.number(),
    name: z.string()
  }),
  z.object({
    event: z.literal("client.ui_action"),
    action: z.enum(["pause", "resume", "stop", "undo", "toggle_cursor", "mode_change"]),
    value: z.unknown().optional()
  })
]);

export type BridgeEvent = z.infer<typeof BridgeEventSchema>;
