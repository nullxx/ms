import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'rc-util/es', replacement: path.resolve(__dirname, 'node_modules/rc-util/es') },
      { find: 'rc-util/lib', replacement: path.resolve(__dirname, 'node_modules/rc-util/lib') },
      { find: /^rc-util$/, replacement: path.resolve(__dirname, 'node_modules/rc-util/es/index.js') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    dedupe: ['react', 'react-dom', 'antd'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
}));
