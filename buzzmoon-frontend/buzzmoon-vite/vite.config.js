import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/buzzmoon/",
  plugins: [react()],
  server: {
    open: true,
    host: true,
  }
})
