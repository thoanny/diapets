import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
// TODO : terminer de configurer PWA (https://vite-pwa-org.netlify.app/guide/)
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: false,
      registerType: 'autoUpdate',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
