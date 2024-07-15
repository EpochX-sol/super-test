import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const htmlLoaderPlugin = {
  name: 'html-loader',
  enforce: 'pre',
  transform(src, id) {
    if (id.endsWith('.html')) {
      return {
        code: `export default ${JSON.stringify(src)};`,
      };
    }
  },
} as import('vite').Plugin;

export default defineConfig({
  plugins: [sveltekit(), htmlLoaderPlugin],
  optimizeDeps: {
    exclude: ['@mapbox/node-pre-gyp'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      external: [
        /node_modules\/@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp\/index\.html/,
      ],
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: {
      // Add any necessary aliases here
    },
  },
});