/**
 * Drops paragraphs with no text. An extra Enter in the Studio leaves an empty
 * block, which would otherwise render as an empty <p> and a double gap.
 */
export function withoutEmptyBlocks(blocks: any[] | undefined): any[] {
  return (blocks ?? []).filter(
    (block) => block?._type !== 'block' || block.children?.some((child: any) => child.text?.trim()),
  )
}
