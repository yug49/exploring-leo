import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Required for WASM support (Provable SDK)
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['@provablehq/wasm'],
  },
  build: {
    target: 'esnext',
  },
  worker: {
    format: 'es',
  },
  // Required headers for SharedArrayBuffer (used by WASM thread pool)
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
