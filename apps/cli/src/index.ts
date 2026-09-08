import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runDoctor } from "./commands/doctor.js";
import { runInstallExtension } from "./commands/install-extension.js";
import { runConfigure } from "./commands/configure.js";
import { runStatus } from "./commands/status.js";
import { runDemo } from "./commands/demo.js";
import { runCreateKnight } from "./commands/create-knight.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "doctor";

  switch (command) {
    case "doctor":
      await runDoctor();
      break;

    case "install-extension":
      await runInstallExtension();
      break;

    case "status":
      await runStatus();
      break;

    case "configure":
      await runConfigure(args[1]);
      break;

    case "demo":
      await runDemo();
      break;

    case "create-knight":
    case "knight":
      await runCreateKnight(args[1]);
      break;

    case "start": {
      const currentDir = dirname(fileURLToPath(import.meta.url));
      const mcpServerScript = join(currentDir, "..", "..", "mcp-server", "dist", "index.js");
      const sub = spawn(process.execPath, [mcpServerScript, ...args.slice(1)], {
        stdio: "inherit"
      });
      sub.on("exit", (code) => {
        process.exit(code ?? 0);
      });
      break;
    }

    default:
      process.stdout.write(`Unknown command: ${command}\n`);
      process.stdout.write("Usage: pixelorama-mcp [doctor | install-extension | configure | status | demo | start]\n");
      process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`Error: ${err}\n`);
  process.exit(1);
});
