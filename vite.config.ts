import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext', // Modern browsers only
    sourcemap: false, // Disable sourcemaps in production for smaller bundles
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks(id) {
          // Separate vendor libraries
          if (id.includes('node_modules')) {
            // Group animation libraries together
            if (id.includes('animejs') || id.includes('matter-js') || 
                id.includes('p5') || id.includes('pixi') || id.includes('three')) {
              return 'vendor-animations'
            }
            // Other vendors
            return 'vendor'
          }
          // Separate utils and lib code
          if (id.includes('/src/lib/')) {
            return 'lib'
          }
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  server: {
    // Optimize dev server
    port: 3000,
    strictPort: false,
    open: true
  },
  
  // Optimize dependencies prebundling
  optimizeDeps: {
    include: ['zustand'], // Force prebundle state management
    exclude: [] // Exclude heavy libs from prebundling if needed
  }
})