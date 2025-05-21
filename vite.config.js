
import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: '/chocolate-data-viz/', // nom exact de ton dépôt GitHub
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
