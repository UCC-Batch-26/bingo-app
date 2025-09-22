import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './tests/setup.js',
    isolate: true,
  },
  resolve: {
    alias: {
      '#tests': resolve(__dirname, './tests'),
      '#modules': resolve(__dirname, './src/modules'),
      '#utils': resolve(__dirname, './src/utils'),
      '#src': resolve(__dirname, './src'),
    },
  },
});
