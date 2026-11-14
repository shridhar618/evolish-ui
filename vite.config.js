import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://<user>.github.io/evolish-ui/
  base: process.env.GITHUB_PAGES ? '/evolish-ui/' : '/',
})
