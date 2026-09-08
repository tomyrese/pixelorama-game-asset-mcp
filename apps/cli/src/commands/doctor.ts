import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createServer } from "node:net";
import { findPixeloramaExecutable, isPixeloramaRunning } from "@pixelorama/pixelorama-bridge";

export async function runDoctor(): Promise<void> {
  process.stdout.write("=========================================\n");
  process.stdout.write("  Pixelorama Game Asset MCP Doctor Check\n");
  process.stdout.write("=========================================\n\n");

  const nodeVer = process.version;
  process.stdout.write(`[1] Node.js Version: ${nodeVer} (OK)\n`);

  const exePath = findPixeloramaExecutable();
  if (exePath) {
    process.stdout.write(`[2] Pixelorama Executable: Found at ${exePath} (OK)\n`);
  } else {
    process.stdout.write("[2] Pixelorama Executable: NOT FOUND (Set PIXELORAMA_PATH environment variable)\n");
  }

  const isRunning = isPixeloramaRunning();
  process.stdout.write(`[3] Pixelorama Process: ${isRunning ? "RUNNING" : "NOT RUNNING"} (OK)\n`);

  const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
  const extDir = join(appData, "pixelorama", "extensions");
  const extZip = join(extDir, "ai_game_asset_studio.zip");
  const configIni = join(appData, "pixelorama", "config.ini");

  if (existsSync(extZip)) {
    process.stdout.write(`[4] Extension Package: Installed at ${extZip} (OK)\n`);
  } else {
    process.stdout.write(`[4] Extension Package: NOT INSTALLED. Run 'pixelorama-mcp install-extension' to install\n`);
  }

  if (existsSync(configIni)) {
    const content = readFileSync(configIni, "utf-8");
    const isEnabled = content.includes("ai_game_asset_studio=true");
    process.stdout.write(`[5] Extension Auto-Enable in config.ini: ${isEnabled ? "ENABLED" : "NOT ENABLED"}\n`);
  } else {
    process.stdout.write(`[5] config.ini: NOT FOUND at ${configIni}\n`);
  }

  const portCheck = await new Promise<boolean>((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(18814, "127.0.0.1");
  });

  process.stdout.write(`[6] Bridge Port (18814): ${portCheck ? "AVAILABLE" : "PORT IN USE"}\n\n`);
  process.stdout.write("Doctor diagnostic complete.\n");
}
