import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages: sithahe.github.io/mobiru
export default defineConfig({
  base: '/mobiru/',
  plugins: [react(), tailwindcss()],
  server: { port: 5185, strictPort: false },
})
