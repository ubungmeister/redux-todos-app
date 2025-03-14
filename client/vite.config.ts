import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //     features: path.resolve(__dirname, 'src/features'),
  //     type: path.resolve(__dirname, 'src/type'),
  //     components: path.resolve(__dirname, 'src/components'),
  //     services: path.resolve(__dirname, 'src/services'),
  //     pages: path.resolve(__dirname, 'src/pages'),
  //     app: path.resolve(__dirname, 'src/app'),
  //   },
  // },
});
