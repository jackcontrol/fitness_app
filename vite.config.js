import { defineConfig } from 'vite';

// GitHub Pages serves this repo at https://jackcontrol.github.io/fitness_app/
// so the build must reference assets under /fitness_app/.
const REPO_BASE = '/fitness_app/';

export default defineConfig({
  base: REPO_BASE,
  build: {
    target: 'es2015',
    outDir: 'dist',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split heavy third-party libs out of the entry chunk so the initial
        // payload stays small. Per-tab chunks (diary, plan, progress, etc.)
        // are added during the rewrite (Step 2 of the refactor plan) once
        // those modules exist under src/ui/.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('chart.js')) return 'vendor-chart';
            if (id.includes('@ericblade/quagga2')) return 'vendor-quagga';
            return 'vendor';
          }
        },
      },
    },
  },
  esbuild: {
    // Strip console + debugger from production builds. Dev keeps them.
    drop: ['console', 'debugger'],
  },
  server: {
    proxy: {
      '/api/claude': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, ''),
      },
    },
  },
});
