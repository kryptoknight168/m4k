import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/m4k/', // Add this line for GitHub Pages
  plugins: [react()],
})
