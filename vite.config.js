import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // netlify dev serves functions on :8888; vite dev proxies /api there
      // so the app works with `npm run dev` too (read-only screens only).
      '/api': 'http://localhost:8888',
    },
  },
})
