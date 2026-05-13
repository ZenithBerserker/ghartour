import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: dir,
  server: {
    port: 5173,
    host: true
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(dir, 'index.html'),
        tour: resolve(dir, 'tour.html'),
        publish: resolve(dir, 'publish.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/playcanvas')) {
            return 'playcanvas';
          }
        }
      }
    }
  }
});
