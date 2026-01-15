import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Required for WASM support (Provable SDK)
  optimizeDeps: {
    exclude: ['@provablehq/wasm'],
  },
  build: {
    target: 'esnext',
  },
})
