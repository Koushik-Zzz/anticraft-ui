import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(projectRoot, "registry.json");
const outputDirectory = path.join(projectRoot, "public", "r");

async function buildRegistry() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (!Array.isArray(manifest.items) || manifest.items.length === 0) {
    throw new Error("registry.json must contain at least one registry item.");
  }

  const names = new Set();
  const items = await Promise.all(
    manifest.items.map(async (item) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name ?? "")) {
        throw new Error(`Invalid registry item name: ${JSON.stringify(item.name)}`);
      }
      if (names.has(item.name)) {
        throw new Error(`Duplicate registry item name: ${item.name}`);
      }
      names.add(item.name);

      if (!Array.isArray(item.files) || item.files.length === 0) {
        throw new Error(`Registry item "${item.name}" must contain files.`);
      }

      const files = await Promise.all(
        item.files.map(async (file) => {
          if (typeof file.path !== "string" || file.path.length === 0) {
            throw new Error(`A file in "${item.name}" is missing its source path.`);
          }
          const sourcePath = path.resolve(projectRoot, file.path);
          const relativePath = path.relative(projectRoot, sourcePath);
          if (relativePath.startsWith(`..${path.sep}`) || relativePath === ".." || path.isAbsolute(relativePath)) {
            throw new Error(`Source path must stay inside the project: ${file.path}`);
          }
          if (file.type === "registry:file" && !file.target) {
            throw new Error(`Registry file "${file.path}" requires a target.`);
          }

          try {
            return { ...file, content: await readFile(sourcePath, "utf8") };
          } catch (error) {
            throw new Error(`Cannot read "${file.path}" for "${item.name}".`, { cause: error });
          }
        }),
      );

      return { ...item, files };
    }),
  );

  await mkdir(outputDirectory, { recursive: true });
  const writeJson = (filename, value) =>
    writeFile(path.join(outputDirectory, filename), `${JSON.stringify(value, null, 2)}\n`, "utf8");

  await Promise.all([
    ...items.map((item) =>
      writeJson(`${item.name}.json`, {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        ...item,
      }),
    ),
    writeJson("registry.json", { ...manifest, items }),
  ]);

  console.log(`Built ${items.length} registry items in public/r/.`);
}

buildRegistry().catch((error) => {
  console.error(error.message);
  if (error.cause) console.error(error.cause.message);
  process.exitCode = 1;
});
