import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA()],
  build: {
    outDir: '../Back/public',
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
})
