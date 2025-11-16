import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'resources',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        templates: path.resolve(__dirname, 'templates.html'),
        resume: path.resolve(__dirname, 'resume.html'),
      },
      output: {
        manualChunks: {
          'vendor-animations': ['animejs', 'splitting'],
          'vendor-graphics': ['three', 'pixi.js'],
          'vendor-charts': ['echarts'],
          'vendor-physics': ['matter-js'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  
  optimizeDeps: {
    include: [
      'animejs',
      'matter-js',
      'echarts',
      'three',
      'pixi.js',
      'splitting',
    ]
  },
  
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})
