import { defineConfig } from 'vite'
import { resolve } from "path";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        popover: resolve(__dirname, "activation-amount-picker.html"),
        background: resolve(__dirname, "background.html"),
      },
    },
  },
})
