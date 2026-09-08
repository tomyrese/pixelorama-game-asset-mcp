import { createWriteStream, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import archiver from "archiver";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "dist");
const extensionDir = join(__dirname, "extension");

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

const outputPath = join(distDir, "ai_game_asset_studio.zip");
const output = createWriteStream(outputPath);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  process.stdout.write(`Packaged extension to ${outputPath} (${archive.pointer()} bytes)\n`);
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

const files = readdirSync(extensionDir);
for (const file of files) {
  const filePath = join(extensionDir, file);
  archive.file(filePath, { name: `src/Extensions/ai_game_asset_studio/${file}` });
}

archive.finalize();
