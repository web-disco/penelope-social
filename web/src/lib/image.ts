/**
 * Image URLs, mirroring the data layer: real Sanity image URLs when connected,
 * otherwise the original Webflow CDN URL stashed in `_migrationSrc` during the
 * scrape.
 */
import imageUrlBuilder from '@sanity/image-url'
import { sanity } from './data'

const builder = sanity ? imageUrlBuilder(sanity) : null

export type MigratedImage = {
  _type?: string
  asset?: { _ref?: string }
  _migrationSrc?: string
  _migrationSrcset?: string
  _migrationSizes?: string
  alt?: string
  width?: number
  height?: number
} | null | undefined

export function imageUrl(image: MigratedImage, width?: number): string {
  if (!image) return ''
  if (builder && image.asset?._ref) {
    let url = builder.image(image as any).auto('format').fit('max')
    if (width) url = url.width(width)
    return url.url()
  }
  return image._migrationSrc || ''
}

/** The `srcset` Webflow emitted, preserved verbatim in file-fallback mode. */
export function imageSrcset(image: MigratedImage, widths = [500, 800, 1080]): string | undefined {
  if (!image) return undefined
  if (builder && image.asset?._ref) {
    return widths
      .map((w) => `${builder.image(image as any).auto('format').fit('max').width(w).url()} ${w}w`)
      .join(', ')
  }
  return image._migrationSrcset || undefined
}

export function imageSizes(image: MigratedImage): string | undefined {
  return image?._migrationSizes || undefined
}

export function imageAlt(image: MigratedImage): string {
  return image?.alt ?? ''
}
