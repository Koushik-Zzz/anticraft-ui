// Vite is used only to bundle the distributable library; the website uses Next.js.
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    outDir: 'lib',
    copyPublicDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/components/anticraft/index.ts'),
      formats: ['es'],
      fileName: 'anticraft-ui',
      cssFileName: 'anticraft-ui',
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: { banner: '"use client";' },
    },
  },
});
