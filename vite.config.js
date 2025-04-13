import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AI/skogsvardeApp/', // La till denna rad
  // talar om för Vite att alla sökvägar till mina JavaScript-, CSS-filer ska vara relativa till /AI/skogsvardeApp
})
