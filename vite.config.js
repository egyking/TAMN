import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'رفيق - Rafeeq',
        short_name: 'رفيق',
        description: 'رعاية تُطمئن قلبك • ونَس يملأ يومك',
        theme_color: '#2EAA1C',
        background_color: '#F5F7FA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-webfonts', expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com/,
            handler: 'NetworkFirst',
            options: { cacheName: 'weather-cache', expiration: { maxAgeSeconds: 3600 } },
          },
        ],
      },
    }),
  ],
});
