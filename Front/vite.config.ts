import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
