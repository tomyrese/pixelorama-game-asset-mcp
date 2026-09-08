import { existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execSync } from "node:child_process";

export async function runInstallExtension(): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = join(currentDir, "..", "..", "..", "..");
  const extensionPkgDist = join(repoRoot, "apps", "pixelorama-extension", "dist", "ai_game_asset_studio.zip");

  if (!existsSync(extensionPkgDist)) {
    process.stdout.write("Building extension package first...\n");
    const buildScript = join(repoRoot, "apps", "pixelorama-extension", "build.js");
    execSync(`node "${buildScript}"`, { stdio: "inherit" });
  }

  const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
  const extDir = join(appData, "pixelorama", "extensions");
  if (!existsSync(extDir)) {
    mkdirSync(extDir, { recursive: true });
  }

  const targetZip = join(extDir, "ai_game_asset_studio.zip");
  copyFileSync(extensionPkgDist, targetZip);
  process.stdout.write(`Copied extension archive to: ${targetZip}\n`);

  const configIniPath = join(appData, "pixelorama", "config.ini");
  let iniContent = "";
  if (existsSync(configIniPath)) {
    iniContent = readFileSync(configIniPath, "utf-8");
  }

  if (iniContent.includes("[extensions]")) {
    if (!iniContent.includes("ai_game_asset_studio=true")) {
      iniContent = iniContent.replace("[extensions]", "[extensions]\n\nai_game_asset_studio=true");
    }
  } else {
    iniContent += "\n\n[extensions]\n\nai_game_asset_studio=true\n";
  }

  writeFileSync(configIniPath, iniContent, "utf-8");
  process.stdout.write(`Configured auto-enable in: ${configIniPath}\n`);
  process.stdout.write("Extension installed and enabled successfully! Restart Pixelorama to activate.\n");
}
