import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mongoose-app/',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/mongoose-app/api': {
        target: 'http://localhost:4567',
        changeOrigin: true
      }
    }
  }
})

