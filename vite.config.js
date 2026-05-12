import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    // ES2015 target for broad compatibility (iOS Safari, older Android)
    target: 'es2015',
    outDir: 'dist',
    // vite-plugin-singlefile inlines all assets; no need for asset hashing
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
  },
  server: {
    // Proxy /api/claude to the Cloudflare Worker in local development
    proxy: {
      '/api/claude': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, ''),
      },
    },
  },
});
