import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    dedupe: ['react', 'react-dom', 'antd'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
  optimizeDeps: {
    include: ['rc-util', 'antd'],
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
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
