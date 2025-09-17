import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})