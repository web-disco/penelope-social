// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // The apex, not `www`. A Cloudflare Redirect Rule 301s `https://www.*` to the
  // root, so `www` is never a URL the site should advertise: canonical tags and
  // the sitemap both derive from this value, and pointing them at a host that
  // redirects away from itself is a contradiction search engines have to guess
  // their way out of. Both hostnames are attached to the Worker as custom
  // domains, so this is purely about which one the build declares.
  site: 'https://penelopesocial.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Joshua submits sitemap-index.xml on sc-domain:penelopesocial.com.
      // Do not sitemap Toast hops or 301 sources.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/'
        return path !== '/sourdough-bakery' && path !== '/reservations' && path !== '/events'
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
