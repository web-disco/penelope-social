import gsap from 'gsap'

/**
 * `.home-menu` hover reveal — fades `.home-menu-hover-media` in and out.
 * Ported verbatim from the Slater bundle (`Bf`).
 *
 * No page currently renders `.home-menu`; the handler is kept (and no-ops)
 * exactly as it does on the live site.
 */
export function initHomeMenuHover() {
  document.querySelectorAll<HTMLElement>('.home-menu').forEach((item) => {
    const hover = item.querySelector<HTMLElement>('.home-menu-hover')
    if (!hover) return

    hover.addEventListener('mouseenter', () => {
      const media = item.querySelector<HTMLElement>('.home-menu-hover-media')
      if (media) gsap.to(media, { opacity: 1 })
    })

    hover.addEventListener('mouseleave', () => {
      const media = item.querySelector<HTMLElement>('.home-menu-hover-media')
      if (media) gsap.to(media, { opacity: 0 })
    })
  })
}
