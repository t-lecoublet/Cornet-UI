import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// Library build: compiles the components to dist/ for npm consumers.
// The raw sources stay the entry point for the embedded/submodule mode.
export default defineConfig({
  plugins: [vue(), libInjectCss()],
  build: {
    lib: {
      entry: {
        index: 'index.ts',
        'plugin-vite': 'plugin-vite.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^vue$/, /^vue\//, 'vite', /^node:/],
      output: {
        // Per-module output keeps consumer bundles tree-shakeable.
        preserveModules: true,
        preserveModulesRoot: '.',
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
