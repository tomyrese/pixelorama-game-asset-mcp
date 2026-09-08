import { writeFileSync } from "node:fs";
import { generateClientConfig, SupportedClient } from "@pixelorama/client-config";

export async function runConfigure(clientArg?: string): Promise<void> {
  const client: SupportedClient = (clientArg as SupportedClient) || "antigravity";
  const nodeExe = process.execPath;
  const config = generateClientConfig(client, nodeExe, [
    "apps/mcp-server/dist/index.js"
  ]);

  process.stdout.write(`Configuration for ${client}:\n`);
  process.stdout.write(JSON.stringify(config.configJson, null, 2) + "\n\n");
  process.stdout.write(`Suggested location: ${config.suggestedFilePath}\n`);

  writeFileSync(config.suggestedFilePath, JSON.stringify(config.configJson, null, 2), "utf-8");
  process.stdout.write(`Written to ${config.suggestedFilePath}\n`);
}
