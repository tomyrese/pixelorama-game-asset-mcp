import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  PixeloramaBridgeServer,
  launchPixelorama,
  isPixeloramaRunning,
  findPixeloramaExecutable
} from "@pixelorama/pixelorama-bridge";
import { resolveArtDirection, BUILTIN_ART_PRESETS } from "@pixelorama/art-direction";
import {
  createCharacterSpec,
  createItemSpec,
  createTilesetSpec
} from "@pixelorama/asset-spec";
import { planPixelArt } from "@pixelorama/pixel-art-planner";
import { inspectGameProject } from "@pixelorama/project-inspector";
import { runAssetCreationWorkflow } from "@pixelorama/workflow-engine";
import { PixelTuple } from "@pixelorama/shared";

export function createPixeloramaMcpServer(bridge: PixeloramaBridgeServer): McpServer {
  const server = new McpServer({
    name: "pixelorama-game-asset-mcp",
    version: "1.0.0"
  });

  server.tool(
    "pixelorama_status",
    "Checks status of Pixelorama process and bridge connection",
    {},
    async () => {
      const isRunning = isPixeloramaRunning();
      const isConnected = bridge.isConnected();
      const executablePath = findPixeloramaExecutable();

      let projectInfo = null;
      if (isConnected) {
        try {
          projectInfo = await bridge.sendCommand({ command: "status" }, 3000);
        } catch {}
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                running: isRunning,
                connected: isConnected,
                executablePath,
                project: projectInfo
              },
              null,
              2
            )
          }
        ]
      };
    }
  );

  server.tool(
    "pixelorama_launch",
    "Launches Pixelorama desktop app and waits for extension to connect",
    {
      customPath: z.string().optional(),
      timeoutSeconds: z.number().int().positive().default(20)
    },
    async ({ customPath, timeoutSeconds }) => {
      const launched = await launchPixelorama(customPath);
      const connected = await bridge.waitForConnection(timeoutSeconds * 1000);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                launched,
                connected,
                message: connected
                  ? "Pixelorama launched and AI Game Asset Studio extension connected successfully"
                  : "Pixelorama process launched, waiting for extension connection"
              },
              null,
              2
            )
          }
        ]
      };
    }
  );

  server.tool(
    "pixelorama_project_create",
    "Creates a new empty project canvas in Pixelorama with specific dimensions",
    {
      name: z.string().default("untitled"),
      width: z.number().int().positive().default(32),
      height: z.number().int().positive().default(32),
      fillColor: z.string().default("#00000000")
    },
    async ({ name, width, height, fillColor }) => {
      const res = await bridge.sendCommand({
        command: "project.create",
        name,
        width,
        height,
        fillColor
      });

      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_project_inspect",
    "Inspects current active Pixelorama project structure (layers, frames, tags, dimensions)",
    {},
    async () => {
      const res = await bridge.sendCommand({ command: "project.inspect" });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_project_save",
    "Saves current project to native .pxo file",
    {
      path: z.string()
    },
    async ({ path }) => {
      const res = await bridge.sendCommand({
        command: "project.save",
        path
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_canvas_snapshot",
    "Captures PNG snapshot of current canvas or specific frame",
    {
      frameIndex: z.number().int().optional()
    },
    async ({ frameIndex }) => {
      const res = (await bridge.sendCommand({
        command: "canvas.snapshot",
        frameIndex
      })) as { width: number; height: number; dataBase64: string };

      if (res && res.dataBase64) {
        return {
          content: [
            {
              type: "image",
              data: res.dataBase64,
              mimeType: "image/png"
            },
            {
              type: "text",
              text: `Snapshot captured for frame ${frameIndex ?? "current"} (${res.width}x${res.height})`
            }
          ]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_layer_create",
    "Creates a new layer above the specified layer index",
    {
      name: z.string(),
      aboveLayer: z.number().int().default(0),
      layerType: z.number().int().default(0)
    },
    async ({ name, aboveLayer, layerType }) => {
      const res = await bridge.sendCommand({
        command: "layer.create",
        name,
        aboveLayer,
        layerType
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_layer_select",
    "Switches active editing layer in Pixelorama",
    {
      layerIndex: z.number().int()
    },
    async ({ layerIndex }) => {
      const res = await bridge.sendCommand({
        command: "layer.select",
        layerIndex
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_frame_create",
    "Adds a new animation frame to the current project",
    {
      afterFrame: z.number().int().default(0)
    },
    async ({ afterFrame }) => {
      const res = await bridge.sendCommand({
        command: "frame.create",
        afterFrame
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_frame_select",
    "Selects active animation frame in timeline",
    {
      frameIndex: z.number().int()
    },
    async ({ frameIndex }) => {
      const res = await bridge.sendCommand({
        command: "frame.select",
        frameIndex
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_draw_pixels",
    "Draws a list of pixels with visible live execution in Pixelorama",
    {
      pixels: z.array(
        z.object({
          x: z.number().int(),
          y: z.number().int(),
          r: z.number().int().min(0).max(255),
          g: z.number().int().min(0).max(255),
          b: z.number().int().min(0).max(255),
          a: z.number().int().min(0).max(255).default(255)
        })
      ),
      mode: z.enum(["live", "fast", "instant"]).default("live")
    },
    async ({ pixels, mode }) => {
      const pixelTuples: PixelTuple[] = pixels.map((p) => [p.x, p.y, p.r, p.g, p.b, p.a ?? 255]);
      const res = await bridge.sendCommand({
        command: "draw.pixels",
        pixels: pixelTuples,
        mode
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_draw_pixel_runs",
    "Draws horizontal pixel runs with live visible execution in Pixelorama",
    {
      runs: z.array(
        z.object({
          y: z.number().int(),
          xStart: z.number().int(),
          xEnd: z.number().int(),
          color: z.string()
        })
      ),
      mode: z.enum(["live", "fast", "instant"]).default("live")
    },
    async ({ runs, mode }) => {
      const res = await bridge.sendCommand({
        command: "draw.pixel_runs",
        runs,
        mode
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_palette_create",
    "Creates and activates a color palette in Pixelorama",
    {
      name: z.string(),
      colors: z.array(z.string()),
      isGlobal: z.boolean().default(false)
    },
    async ({ name, colors, isGlobal }) => {
      const res = await bridge.sendCommand({
        command: "palette.create",
        name,
        colors,
        isGlobal
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_animation_create_tag",
    "Creates a named animation tag for a range of timeline frames",
    {
      name: z.string(),
      fromFrame: z.number().int(),
      toFrame: z.number().int(),
      color: z.string().default("#2ecc71")
    },
    async ({ name, fromFrame, toFrame, color }) => {
      const res = await bridge.sendCommand({
        command: "animation.create_tag",
        name,
        fromFrame,
        toFrame,
        color
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_animation_play",
    "Starts timeline playback inside Pixelorama",
    {
      forward: z.boolean().default(true)
    },
    async ({ forward }) => {
      const res = await bridge.sendCommand({
        command: "animation.play",
        forward
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_animation_stop",
    "Stops timeline playback inside Pixelorama",
    {},
    async () => {
      const res = await bridge.sendCommand({ command: "animation.stop" });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_export_spritesheet",
    "Exports full animation frames to a spritesheet PNG",
    {
      path: z.string(),
      columns: z.number().int().positive().optional(),
      rows: z.number().int().positive().optional()
    },
    async ({ path, columns, rows }) => {
      const res = await bridge.sendCommand({
        command: "export.spritesheet",
        path,
        columns,
        rows
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "pixelorama_cursor_set",
    "Updates AI cursor position and badge overlay on canvas",
    {
      x: z.number().int(),
      y: z.number().int(),
      tool: z.string().default("Pencil"),
      color: z.string().default("#000000"),
      stage: z.string().default("Drawing"),
      message: z.string().optional()
    },
    async ({ x, y, tool, color, stage, message }) => {
      const res = await bridge.sendCommand({
        command: "cursor.set",
        x,
        y,
        tool,
        color,
        stage,
        message
      });
      return {
        content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
      };
    }
  );

  server.tool(
    "project_inspect_art_direction",
    "Inspects current workspace game repo to infer art direction and resolution",
    {
      workspacePath: z.string()
    },
    async ({ workspacePath }) => {
      const result = inspectGameProject(workspacePath);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  server.tool(
    "asset_create",
    "High-level workflow: creates, live draws, animates, validates, fixes, and exports an original game asset in Pixelorama",
    {
      id: z.string(),
      name: z.string(),
      type: z.enum(["character", "item", "tileset"]).default("character"),
      width: z.number().int().positive().default(32),
      height: z.number().int().positive().default(32),
      preset: z.string().default("cozy_farm_32"),
      outputDirectory: z.string(),
      drawingMode: z.enum(["live", "fast", "instant"]).default("live"),
      animations: z.array(z.string()).default(["idle", "walk"]),
      directions: z.array(z.enum(["down", "left", "right", "up"])).default(["down", "left", "right", "up"])
    },
    async ({ id, name, type, width, height, preset, outputDirectory, drawingMode, animations, directions }) => {
      if (!isPixeloramaRunning()) {
        await launchPixelorama();
      }
      await bridge.waitForConnection(15000);

      const artDirection = resolveArtDirection(preset);
      let spec;

      if (type === "character") {
        spec = createCharacterSpec({
          id,
          name,
          width,
          height,
          animations,
          directions: directions ?? ["down", "left", "right", "up"]
        });
      } else if (type === "item") {
        spec = createItemSpec({ id, name, width, height });
      } else {
        spec = createTilesetSpec({ id, name, tileSize: width });
      }

      const result = await runAssetCreationWorkflow(bridge, {
        spec,
        artDirection,
        drawingMode,
        outputDirectory
      });

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  server.resource(
    "pixelorama_status",
    "pixelorama://status",
    async () => {
      const isRunning = isPixeloramaRunning();
      const isConnected = bridge.isConnected();
      return {
        contents: [
          {
            uri: "pixelorama://status",
            mimeType: "application/json",
            text: JSON.stringify({ running: isRunning, connected: isConnected })
          }
        ]
      };
    }
  );

  server.prompt(
    "create_character",
    "Generates an original pixel art character with animations in Pixelorama",
    {
      description: z.string(),
      style: z.string().default("cozy farming RPG"),
      size: z.string().default("32x32")
    },
    ({ description, style, size }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Design an original character in Pixelorama: ${description}. Style: ${style}, Dimensions: ${size}. Use the live visible drawing pipeline with layers for shadow, body, clothing, and hair. Create real keyframe poses for idle and walk animations, validate against duplicate frames, and export spritesheet.`
            }
          }
        ]
      };
    }
  );

  return server;
}
