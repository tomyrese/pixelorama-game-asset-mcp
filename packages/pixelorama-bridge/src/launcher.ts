import { spawn, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { platform } from "node:process";
import { PixeloramaMcpError, ErrorCodes } from "@pixelorama/shared";

export function findPixeloramaExecutable(): string | null {
  if (process.env.PIXELORAMA_PATH && existsSync(process.env.PIXELORAMA_PATH)) {
    return process.env.PIXELORAMA_PATH;
  }

  const osType = platform;
  if (osType === "win32") {
    const userAppData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
    const localAppData = process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local");
    const progFiles = process.env["ProgramFiles"] || "C:\\Program Files";
    const progFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";

    const candidates = [
      join(userAppData, "Orama Interactive", "Pixelorama", "Pixelorama.exe"),
      join(localAppData, "Programs", "Pixelorama", "Pixelorama.exe"),
      join(progFiles, "Pixelorama", "Pixelorama.exe"),
      join(progFilesX86, "Pixelorama", "Pixelorama.exe")
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    try {
      const output = execSync("where.exe pixelorama", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      if (output && existsSync(output.split(/\r?\n/)[0])) {
        return output.split(/\r?\n/)[0];
      }
    } catch {}
  } else if (osType === "darwin") {
    const candidates = [
      "/Applications/Pixelorama.app/Contents/MacOS/Pixelorama",
      join(homedir(), "Applications", "Pixelorama.app", "Contents", "MacOS", "Pixelorama")
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }
  } else {
    const candidates = [
      "/usr/bin/pixelorama",
      "/usr/local/bin/pixelorama",
      join(homedir(), ".local", "bin", "pixelorama")
    ];
    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }
    try {
      const output = execSync("which pixelorama", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
      if (output && existsSync(output)) {
        return output;
      }
    } catch {}
  }

  return null;
}

export function isPixeloramaRunning(): boolean {
  try {
    const osType = platform;
    if (osType === "win32") {
      const output = execSync("tasklist /FI \"IMAGENAME eq Pixelorama.exe\" /NH", {
        stdio: ["ignore", "pipe", "ignore"]
      }).toString();
      return output.toLowerCase().includes("pixelorama.exe");
    } else {
      const output = execSync("pgrep -i pixelorama", {
        stdio: ["ignore", "pipe", "ignore"]
      }).toString();
      return output.trim().length > 0;
    }
  } catch {
    return false;
  }
}

export async function launchPixelorama(customPath?: string): Promise<boolean> {
  if (isPixeloramaRunning()) {
    return true;
  }

  const exePath = customPath || findPixeloramaExecutable();
  if (!exePath || !existsSync(exePath)) {
    throw new PixeloramaMcpError(
      ErrorCodes.PIXELORAMA_NOT_RUNNING,
      "Pixelorama executable not found on system. Please set PIXELORAMA_PATH environment variable."
    );
  }

  const subprocess = spawn(exePath, [], {
    detached: true,
    stdio: "ignore"
  });

  subprocess.unref();

  for (let i = 0; i < 20; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (isPixeloramaRunning()) {
      return true;
    }
  }

  return isPixeloramaRunning();
}
