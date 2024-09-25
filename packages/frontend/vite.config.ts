import dotenv from 'dotenv';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

dotenv.config();

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const config = {
    plugins: [react()],
    define: {
      'process.env': process.env,
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_BACKEND_ENDPOINT,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
  return defineConfig(config);
};
