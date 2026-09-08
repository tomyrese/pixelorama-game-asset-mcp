import { PixeloramaBridgeServer } from "@pixelorama/pixelorama-bridge";
import { createPixeloramaMcpServer } from "./server.js";
import { runStdioServer } from "./transports/stdio.js";
import { runHttpServer } from "./transports/http.js";

async function main() {
  const args = process.argv.slice(2);
  const isHttp = args.includes("--http");
  const portIndex = args.indexOf("--port");
  const httpPort = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1], 10) : 3000;

  const bridge = new PixeloramaBridgeServer();
  await bridge.start();

  const mcpServer = createPixeloramaMcpServer(bridge);

  if (isHttp) {
    await runHttpServer(mcpServer, httpPort);
    process.stderr.write(`Pixelorama MCP Streamable HTTP Server running on http://127.0.0.1:${httpPort}\n`);
  } else {
    await runStdioServer(mcpServer);
    process.stderr.write("Pixelorama MCP Stdio Server running\n");
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal error starting Pixelorama MCP server: ${err}\n`);
  process.exit(1);
});
