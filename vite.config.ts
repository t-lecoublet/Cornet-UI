import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import cornetPlugin from 'cornet-ui/plugin-vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cornetPlugin({
      showOutput: true
    }),
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': fileURLToPath(new URL('./node_modules/vue/dist/vue.esm-bundler.js', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/lib/components/') || id.includes('/lib/composables/')) {
            return 'vendor-cornet'
          }
        },
      },
    },
  },
})
