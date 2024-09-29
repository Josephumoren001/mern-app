import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: process.env.VITE_API_URL === 'localhost:8080' ? {
      '/api': {
        target: 'localhost:8080',
        changeOrigin: true,
        secure: true,
      },
    } : {},
  },
  plugins: [react()],
});

//https://mern-app-7q9y.onrender.com