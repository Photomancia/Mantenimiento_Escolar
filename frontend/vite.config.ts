/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // API_PROXY_TARGET no lleva prefijo VITE_: solo lo usa el servidor de
  // desarrollo y nunca llega al navegador.
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.API_PROXY_TARGET || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 5173,
      strictPort: true,
      proxy: {
        // En desarrollo, /api/* se reenvía al backend PHP local (evita CORS).
        '/api': { target: proxyTarget, changeOrigin: true },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
