import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const destination = resolve(process.argv[2] || "replica-alpaca-negra");
const files = [
  "index.html",
  "assets",
  "Dockerfile",
  "LICENSE",
  "README.md",
  "docs",
  "skills/replicar-alpaca-negra",
  "instagram_DaQLsDwloME.mp4",
];

if (existsSync(destination) && readdirSync(destination).length) {
  throw new Error(`El directorio de destino debe estar vacío: ${destination}`);
}

mkdirSync(destination, { recursive: true });
for (const name of files) {
  cpSync(resolve(source, name), resolve(destination, name), { recursive: true, force: false, errorOnExist: true });
}

console.log(`Réplica creada en ${destination}`);
