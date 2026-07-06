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
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
