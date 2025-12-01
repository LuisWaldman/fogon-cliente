import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'

const packageJson = JSON.parse(
  readFileSync('./package.json', { encoding: 'utf-8' }),
)

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // 🔁 auto actualiza si hay una nueva versión
      devOptions: {
        enabled: true, // ✅ para que funcione durante desarrollo
      },
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      /* eslint-disable camelcase */
      manifest: {
        name: 'Fogón',
        short_name: 'Fogón',
        description: 'Red social distribuida para musicos',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'img/iconogrande.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      /* eslint-enable camelcase */
      workbox: {
        // aumentar a 5 MiB
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

        runtimeCaching: [
          {
            // Cachear todas las imágenes
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60, // máximo de imágenes guardadas
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
        ],
      },
    }),
  ],
})
