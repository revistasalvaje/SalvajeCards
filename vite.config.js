import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'f9095f3d-24e7-47f7-9549-940a22a917ec-00-9ij3dx6dne28.kirk.replit.dev' // tu host real
    ]
  }
})
