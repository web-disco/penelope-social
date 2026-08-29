// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { access, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * @astrojs/sitemap emits sitemap-index.xml + sitemap-0.xml. Also write
 * /sitemap.xml so that path does not 404. Joshua submits sitemap-index.xml
 * on the apex property.
 */
function sitemapXmlAlias() {
  return {
    name: 'sitemap-xml-alias',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir)
        const dest = path.join(out, 'sitemap.xml')
        const urlset = path.join(out, 'sitemap-0.xml')
        const indexFile = path.join(out, 'sitemap-index.xml')
        try {
          await access(dest)
          return
        } catch {
          /* write below */
        }
        let src = urlset
        try {
          await access(urlset)
        } catch {
          src = indexFile
        }
        await copyFile(src, dest)
        logger.info('Wrote /sitemap.xml alias')
      },
    },
  }
}

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
  integrations: [sitemap(), sitemapXmlAlias()],
  vite: {
    plugins: [tailwindcss()],
  },
})
