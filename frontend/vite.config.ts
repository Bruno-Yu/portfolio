import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.VITE_BASE_PATH || '/'
  return {
    plugins: [react()],
    base: basePath,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || env.VITE_API_PREFIX || 'http://127.0.0.1:8787',
          changeOrigin: true,
          // Keep /api prefix — production API expects /api/works, /api/skills etc.
        },
      },
    },
  }
})
