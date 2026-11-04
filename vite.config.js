import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Chemins relatifs : le site marche sur Vercel, Netlify ET GitHub Pages.
  base: './',
})
