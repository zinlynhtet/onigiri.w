import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages subdirectory: /onigiri.w/
  // Development: use './' for relative paths
  base: process.env.NODE_ENV === 'production' ? '/onigiri.w/' : './',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        signup: 'signup.html',
        forgot: 'forgot-password.html',
        reset: 'reset-password.html',
        learn: 'learn.html'
      }
    }
  }
});
