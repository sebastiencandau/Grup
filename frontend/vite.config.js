import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // Important : permet d’écouter sur toutes les interfaces, pas juste localhost
    port: 5173
  }
})
