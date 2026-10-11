import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const repoPagesBase = '/ai-video-platform/'

/** Ensures a leading and trailing slash (Vite `base` format). */
function normalizeBase(raw: string | undefined, fallback: string): string {
  if (!raw || raw === '/') {
    return fallback
  }
  let base = raw.startsWith('/') ? raw : `/${raw}`
  if (!base.endsWith('/')) {
    base += '/'
  }
  return base
}

const base = normalizeBase(
  process.env.VITE_BASE_PATH,
  process.env.GITHUB_PAGES === 'true' ? repoPagesBase : '/',
)

const appDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Everything AI — AI Video Platform',
        short_name: 'Everything AI',
        description:
          'Netflix-like streaming for AI-generated series, episodes, and creator monetization.',
        theme_color: '#0b0b0f',
        background_color: '#0b0b0f',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: `${base}favicon.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
    {
      name: 'github-pages-spa-fallback',
      closeBundle() {
        if (base === '/') {
          return
        }
        const distDir = path.join(appDir, 'dist')
        const indexHtml = path.join(distDir, 'index.html')
        const fallbackHtml = path.join(distDir, '404.html')
        fs.copyFileSync(indexHtml, fallbackHtml)
      },
    },
  ],
})
