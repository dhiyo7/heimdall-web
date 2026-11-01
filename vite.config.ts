import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Port tetap: tautan email & verificationUri device dari cloud mengarah ke sini
  // (cloud/src/core/config/env.ts -> PUBLIC_WEB_URL). strictPort mencegah Vite
  // diam-diam pindah ke 5174 sehingga tautan email jadi salah.
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    /* Optimize for SEO and performance */
    sourcemap: false, // Reduce bundle size
    minify: 'terser', // Better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
      },
    },
  },
  base: '/',
})