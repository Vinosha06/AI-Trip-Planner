import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Disable file system watching completely to prevent EBUSY locks on system files like NTUSER.DAT
    watch: {
      ignored: ['**/*'],
    },
  },
})