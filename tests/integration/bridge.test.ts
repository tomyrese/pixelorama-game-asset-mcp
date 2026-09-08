import { describe, it, expect, afterEach } from "vitest";
import { WebSocket } from "ws";
import { PixeloramaBridgeServer } from "@pixelorama/pixelorama-bridge";

describe("PixeloramaBridgeServer Integration", () => {
  let server: PixeloramaBridgeServer;

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  it("starts, accepts connection, and dispatches command response", async () => {
    server = new PixeloramaBridgeServer({ port: 18815 });
    await server.start();

    const client = new WebSocket("ws://127.0.0.1:18815");
    await new Promise<void>((resolve) => {
      client.on("open", () => resolve());
    });

    client.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.command && msg.command.command === "status") {
        client.send(
          JSON.stringify({
            id: msg.id,
            success: true,
            data: { connected: true, hasProject: true, projectName: "test_proj" }
          })
        );
      }
    });

    const isConnected = await server.waitForConnection(5000);
    expect(isConnected).toBe(true);

    const res = await server.sendCommand<{ projectName: string }>({ command: "status" });
    expect(res.projectName).toBe("test_proj");

    client.close();
  });
});
