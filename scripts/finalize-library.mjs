import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('..', import.meta.url));
const root = resolve(project, 'lib/types');
async function cleanDeclarations(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await cleanDeclarations(path);
    else if (entry.name.endsWith('.d.ts')) {
      const source = await readFile(path, 'utf8');
      // The library bundles styles separately; declarations must not import absent CSS.
      await writeFile(path, source.replace(/^import\s+['"][^'"]+\.css['"];?\r?\n/gm, ''));
    }
  }
}
await cleanDeclarations(root);
const application = JSON.parse(await readFile(resolve(project, 'package.json'), 'utf8'));
// Pack the library independently so consuming apps do not install Next.js or a second React.
const manifest = {
  name: '@anticraft-ui/react',
  version: application.version,
  description: application.description,
  license: 'MIT',
  type: 'module',
  main: './anticraft-ui.js',
  module: './anticraft-ui.js',
  types: './types/index.d.ts',
  exports: {
    '.': { types: './types/index.d.ts', import: './anticraft-ui.js' },
    './styles.css': './anticraft-ui.css',
  },
  files: ['*.js', '*.css', 'types', 'README.md', 'LICENSE'],
  sideEffects: ['**/*.css'],
  peerDependencies: { react: '>=18.0.0', 'react-dom': '>=18.0.0' },
};
await Promise.all([
  writeFile(resolve(project, 'lib/package.json'), JSON.stringify(manifest, null, 2) + '\n'),
  writeFile(resolve(project, 'lib/LICENSE'), await readFile(resolve(project, 'LICENSE'), 'utf8')),
  writeFile(resolve(project, 'lib/README.md'), '# Anticraft UI\n\nFree MIT-licensed React components.\n\n```tsx\nimport { MagneticButton } from "@anticraft-ui/react";\nimport "@anticraft-ui/react/styles.css";\n```\n\nDocumentation source: https://github.com/Koushik-Zzz/anticraft-ui\n'),
]);
console.log('Finalized standalone library package and declarations.');
