#!/usr/bin/env node
/**
 * Structural parity comparator.
 *
 * Diffs the live Webflow DOM against the built output by **tag nesting**, not
 * class names — the port re-expresses the design in Tailwind, so class names
 * deliberately differ. What must match is the shape of the document.
 *
 *   node compare.js              # all routes
 *   node compare.js /menus/lunch # one route
 *
 * Run `pnpm --filter @penelope/web build` first.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import { SITE } from './lib/scrape.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(here, '../web/dist')

const ROUTES = [
  '/',
  '/menus',
  '/menus/lunch',
  '/menus/dinner',
  '/menus/bar',
  '/menus/catering',
  '/about',
  '/sourdough-bakery',
  '/catering-events',
  '/contact',
  '/merchandise',
  '/merchandise/hoodie',
  '/merchandise/t-shirt',
  '/merchandise/tote-bag',
]

/** Nodes that exist on only one side by design. */
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'svg', 'iframe', 'link', 'br'])

/**
 * Nodes that exist on only one side by design:
 *  - `w-json`      the native Webflow lightbox template, replaced by GLightbox.
 *  - `w-dyn-hide` / `w-dyn-bind-empty`
 *                  markup Webflow emits for an empty CMS field and then hides
 *                  with `display:none !important` in its own stylesheet. The
 *                  port simply doesn't render it; nothing is visible either way.
 *  - `cf-turnstile` the captcha widget, which has no Webflow counterpart.
 *  - `newsletter-consent`
 *                  the CASL consent checkbox on the footer signup. Added by the
 *                  port — the Webflow form collected no consent at all — so it
 *                  has nothing to diff against.
 *  - `newsletter`   the homepage signup overlay. Webflow ships the markup but
 *                   sets `display:none` on it with no override, no trigger and
 *                   no close button, so it never renders for anyone. The port
 *                   drops it rather than carrying a full-screen modal that can
 *                   only ever appear by accident.
 */
const IGNORE_CLASSES = [
  'w-json',
  'w-dyn-hide',
  'w-dyn-bind-empty',
  'cf-turnstile',
  'newsletter-consent',
  'newsletter',
]

/**
 * Links dropped from the port on purpose, matched on the live site's href.
 *
 * The drawer lists the catering page twice: "Events" -> /catering-events and
 * "Catering & Events" -> /events?general-inquiry, where /events is itself a 301
 * to /catering-events. One menu entry per page, pointing straight at it, so the
 * second one is gone — which makes its `<a>` (and the `<h2>` inside it)
 * live-only on all fourteen routes.
 */
const IGNORE_HREFS = ['/events?general-inquiry']

function outline(doc) {
  const root = doc.querySelector('.page-wrapper')
  if (!root) return []
  const lines = []

  const isIgnored = (el) => {
    const className = typeof el.className === 'string' ? el.className : ''
    const classes = className.split(/\s+/)
    if (IGNORE_CLASSES.some((c) => classes.includes(c))) return true
    return IGNORE_HREFS.includes(el.getAttribute?.('href') ?? '')
  }

  /** True once every descendant has been ignored — i.e. the node renders nothing. */
  const isEmptyWrapper = (el) => {
    if (el.textContent.trim()) return false
    const children = [...el.children].filter((c) => !SKIP_TAGS.has(c.tagName.toLowerCase()))
    if (!children.length) return false
    return children.every((c) => isIgnored(c) || isEmptyWrapper(c))
  }

  const walk = (el, depth) => {
    const tag = el.tagName.toLowerCase()
    if (SKIP_TAGS.has(tag)) return
    if (isIgnored(el) || isEmptyWrapper(el)) return

    lines.push(`${'  '.repeat(depth)}${tag}`)
    for (const child of el.children) walk(child, depth + 1)
  }

  for (const child of root.children) walk(child, 0)
  return lines
}

function diff(liveLines, localLines) {
  const liveCount = new Map()
  const localCount = new Map()
  for (const line of liveLines) liveCount.set(line, (liveCount.get(line) ?? 0) + 1)
  for (const line of localLines) localCount.set(line, (localCount.get(line) ?? 0) + 1)

  const liveOnly = []
  const localOnly = []
  for (const [line, n] of liveCount) {
    const delta = n - (localCount.get(line) ?? 0)
    if (delta > 0) liveOnly.push(`${line} ×${delta}`)
  }
  for (const [line, n] of localCount) {
    const delta = n - (liveCount.get(line) ?? 0)
    if (delta > 0) localOnly.push(`${line} ×${delta}`)
  }
  return { liveOnly, localOnly }
}

async function compareRoute(route) {
  const response = await fetch(`${SITE}${route}`, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    },
  })
  if (!response.ok) throw new Error(`${response.status} fetching ${route}`)
  const liveDoc = new JSDOM(await response.text()).window.document

  const file = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`
  const localPath = path.join(distDir, file)
  if (!fs.existsSync(localPath)) {
    console.log(`✗ ${route}: no build output at ${localPath} — run the build first`)
    return false
  }
  const localDoc = new JSDOM(fs.readFileSync(localPath, 'utf8')).window.document

  const { liveOnly, localOnly } = diff(outline(liveDoc), outline(localDoc))

  if (!liveOnly.length && !localOnly.length) {
    console.log(`✓ ${route}`)
    return true
  }

  console.log(`✗ ${route}`)
  /* Keep the indentation: it is the nesting depth, which is what identifies
     where in the tree the difference sits. */
  for (const line of liveOnly) console.log(`    live-only : ${line}`)
  for (const line of localOnly) console.log(`    local-only: ${line}`)
  return false
}

const routes = process.argv.slice(2).filter((arg) => arg.startsWith('/'))
const targets = routes.length ? routes : ROUTES

let failures = 0
for (const route of targets) {
  const ok = await compareRoute(route)
  if (!ok) failures += 1
}

console.log(`\n${targets.length - failures}/${targets.length} routes structurally identical`)
process.exit(failures ? 1 : 0)
