import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

/** GitHub Project Pages: set `VITE_BASE_PATH=/your-repo/` in CI (trailing slash). */
const base = (process.env.VITE_BASE_PATH || '/').replace(/\/?$/, '/');

export default defineConfig({
  root: dir,
  base,
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
