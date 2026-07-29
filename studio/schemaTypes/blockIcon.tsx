/**
 * Shared "block" icon used by every page-builder section, so the builder reads
 * as a consistent, scannable stack rather than a mix of photo thumbnails and
 * generic document icons. Used as both the section type icon (insert menu) and
 * the array-item preview media.
 */
export function BlockIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-sanity-icon="block"
    >
      <rect x="5" y="5.5" width="15" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5" y="12.5" width="15" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}
