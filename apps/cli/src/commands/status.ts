import { isPixeloramaRunning, findPixeloramaExecutable } from "@pixelorama/pixelorama-bridge";

export async function runStatus(): Promise<void> {
  const isRunning = isPixeloramaRunning();
  const exePath = findPixeloramaExecutable();

  process.stdout.write(`Pixelorama Running: ${isRunning ? "YES" : "NO"}\n`);
  process.stdout.write(`Executable Path: ${exePath ?? "NOT FOUND"}\n`);
}
