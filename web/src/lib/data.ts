/**
 * Data layer with a file fallback.
 *
 * When PUBLIC_SANITY_PROJECT_ID is set the site reads from Sanity. Until then
 * it reads the JSON the migration script writes in `--dry` mode
 * (`scripts/output/<type>.json`), so the whole project builds and can be
 * reviewed before the Sanity project exists.
 */
import { createClient, type SanityClient } from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

/**
 * `useCdn: false` is deliberate.
 *
 * This site is fully static, so every query runs at build time and is then
 * baked into HTML — there is no runtime client left to benefit from the CDN.
 * Worse, the CDN caches per query+params including *negative* results, so a
 * build kicked off moments after a publish (exactly what a publish webhook
 * does) can be served the pre-publish answer and bake in stale or missing
 * content. Fetching live costs one round trip per query at build time and
 * removes that whole class of bug.
 */
export const sanity: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      useCdn: false,
      perspective: 'published',
    })
  : null

export const usingSanity = Boolean(sanity)

/* Resolved from the working directory (always `web/` for astro dev|build)
   rather than import.meta.url, which points into the bundled server chunk. */
const outputDir = path.resolve(process.cwd(), '../scripts/output')

const fileCache = new Map<string, any[]>()

function readTypeFile(type: string): any[] {
  if (!import.meta.env.DEV && fileCache.has(type)) return fileCache.get(type)!
  const file = path.join(outputDir, `${type}.json`)
  let docs: any[] = []
  if (fs.existsSync(file)) {
    try {
      docs = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (err) {
      console.warn(`[data] could not parse ${file}:`, err)
    }
  }
  fileCache.set(type, docs)
  return docs
}

/** id -> doc across every dumped type, so `resolveRef` works in file mode. */
let fileIndex: Map<string, any> | null = null

function getFileIndex(): Map<string, any> {
  if (fileIndex && !import.meta.env.DEV) return fileIndex
  const index = new Map<string, any>()
  if (fs.existsSync(outputDir)) {
    for (const entry of fs.readdirSync(outputDir)) {
      if (!entry.endsWith('.json')) continue
      const type = entry.replace(/\.json$/, '')
      for (const doc of readTypeFile(type)) {
        if (doc?._id) index.set(doc._id, doc)
      }
    }
  }
  fileIndex = index
  return index
}

export async function getAll<T = any>(type: string): Promise<T[]> {
  if (sanity) {
    return sanity.fetch(`*[_type == $type && !(_id in path("drafts.**"))]`, { type })
  }
  return readTypeFile(type) as T[]
}

export async function getOne<T = any>(type: string, slug: string): Promise<T | null> {
  if (sanity) {
    const doc = await sanity.fetch(
      `*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]`,
      { type, slug },
    )
    return doc ?? null
  }
  const docs = readTypeFile(type)
  return (docs.find((d) => d?.slug?.current === slug) as T) ?? null
}

export async function getSingleton<T = any>(type: string): Promise<T | null> {
  if (sanity) {
    const doc = await sanity.fetch(`*[_type == $type][0]`, { type })
    return doc ?? null
  }
  return (readTypeFile(type)[0] as T) ?? null
}

/** Resolve a `{_type:'reference', _ref}` to the referenced document. */
export async function resolveRef<T = any>(ref: any): Promise<T | null> {
  if (!ref) return null
  const id = typeof ref === 'string' ? ref : ref._ref
  if (!id) return (ref as T) ?? null
  if (sanity) {
    const doc = await sanity.fetch(`*[_id == $id][0]`, { id })
    return doc ?? null
  }
  return (getFileIndex().get(id) as T) ?? null
}

export async function resolveRefs<T = any>(refs: any[] | undefined): Promise<T[]> {
  if (!refs?.length) return []
  const resolved = await Promise.all(refs.map((r) => resolveRef<T>(r)))
  return resolved.filter(Boolean) as T[]
}

/** Site settings, with a hard fallback so pages never crash on a fresh clone. */
export async function getSiteSettings(): Promise<any> {
  const settings = await getSingleton('siteSettings')
  if (settings) return settings
  throw new Error(
    'No siteSettings found. Run `pnpm migrate:dry` to generate scripts/output, ' +
      'or set PUBLIC_SANITY_PROJECT_ID to read from Sanity.',
  )
}
