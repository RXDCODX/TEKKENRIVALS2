import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Matching on the resolved path rather than listing package names:
        // the name form only claims each package's entry module, which left
        // React's actual implementation to be swept into whichever chunk
        // reached it first — the gsap one. That put ~30 kB gzipped of GSAP in
        // front of every visitor, including the mobile layout, which renders
        // static text and no video and never touches it.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules[\\/]@?gsap[\\/]/.test(id)) return 'gsap';
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'vendor';
          }
        },
      },
    },
  },
});
