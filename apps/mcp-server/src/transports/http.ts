import { createServer } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export async function runHttpServer(server: McpServer, port = 3000): Promise<void> {
  const httpServer = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => `session-${Date.now()}`
  });

  await server.connect(transport);

  httpServer.on("request", (req, res) => {
    transport.handleRequest(req, res);
  });

  return new Promise((resolve) => {
    httpServer.listen(port, "127.0.0.1", () => {
      resolve();
    });
  });
}
