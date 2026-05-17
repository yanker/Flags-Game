import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import VitePWA from '@vite-pwa/astro';

export default defineConfig({
  output: 'static',
  integrations: [
    preact({ compat: false }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Banderas — Juego de Banderas',
        short_name: 'Banderas',
        description: 'Juego de adivinar banderas del mundo',
        lang: 'es',
        theme_color: '#4ECDC4',
        background_color: '#f0f9ff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'flag-images',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
