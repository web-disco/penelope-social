/**
 * Drops paragraphs with no text. An extra Enter in the Studio leaves an empty
 * block, which would otherwise render as an empty <p> and a double gap.
 */
export function withoutEmptyBlocks(blocks: any[] | undefined): any[] {
  return (blocks ?? []).filter(
    (block) => block?._type !== 'block' || block.children?.some((child: any) => child.text?.trim()),
  )
}

/** Portable Text or a legacy plain string, flattened for JSON-LD and meta. */
export function plainText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .filter((block) => block?._type === 'block')
    .map((block) => (block.children ?? []).map((child: any) => child.text ?? '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
