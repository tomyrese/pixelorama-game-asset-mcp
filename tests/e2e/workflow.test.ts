import { describe, it, expect, afterEach } from "vitest";
import { WebSocket } from "ws";
import { join } from "node:path";
import { mkdirSync, existsSync, rmSync } from "node:fs";
import { PixeloramaBridgeServer } from "@pixelorama/pixelorama-bridge";
import { createCharacterSpec } from "@pixelorama/asset-spec";
import { resolveArtDirection } from "@pixelorama/art-direction";
import { runAssetCreationWorkflow } from "@pixelorama/workflow-engine";

describe("E2E Asset Creation Workflow", () => {
  let server: PixeloramaBridgeServer;
  const testOutDir = join(process.cwd(), "tests", "fixtures", "e2e_out");

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
    if (existsSync(testOutDir)) {
      try {
        rmSync(testOutDir, { recursive: true, force: true });
      } catch {}
    }
  });

  it("runs full creation, live drawing, validation, and export workflow", async () => {
    mkdirSync(testOutDir, { recursive: true });

    server = new PixeloramaBridgeServer({ port: 18816 });
    await server.start();

    const client = new WebSocket("ws://127.0.0.1:18816");
    await new Promise<void>((resolve) => {
      client.on("open", () => resolve());
    });

    client.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.command) {
        const cmd = msg.command.command;
        if (cmd === "canvas.snapshot") {
          const w = 32;
          const h = 32;
          const dummyBuf = Buffer.alloc(w * h * 4);
          for (let i = 0; i < w * h; i++) {
            dummyBuf[i * 4] = 100 + (msg.command.frameIndex || 0) * 10;
            dummyBuf[i * 4 + 1] = 120;
            dummyBuf[i * 4 + 2] = 140;
            dummyBuf[i * 4 + 3] = 255;
          }
          client.send(
            JSON.stringify({
              id: msg.id,
              success: true,
              data: {
                width: w,
                height: h,
                dataBase64: dummyBuf.toString("base64")
              }
            })
          );
        } else {
          client.send(
            JSON.stringify({
              id: msg.id,
              success: true,
              data: { success: true }
            })
          );
        }
      }
    });

    const isConnected = await server.waitForConnection(5000);
    expect(isConnected).toBe(true);

    const spec = createCharacterSpec({
      id: "e2e_farmer",
      name: "E2E Farmer",
      width: 32,
      height: 32,
      animations: ["idle", "walk"],
      directions: ["down"]
    });

    const artDirection = resolveArtDirection("cozy_farm_32");

    const result = await runAssetCreationWorkflow(server, {
      spec,
      artDirection,
      drawingMode: "instant",
      outputDirectory: testOutDir
    });

    expect(result.state).toBe("PASS");
    expect(result.validationReport.status).toBe("PASS");
    expect(result.exportPaths).toBeDefined();
    expect(existsSync(result.exportPaths!.metadataJson)).toBe(true);

    client.close();
  });
});
