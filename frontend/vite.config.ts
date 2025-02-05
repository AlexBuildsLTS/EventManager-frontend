import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['@emotion/styled', '@mui/material/Tooltip', '@mui/material/Fade']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});