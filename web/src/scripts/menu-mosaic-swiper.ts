import Swiper from 'swiper'
import 'swiper/css'

/**
 * Below 992px the menu mosaic is a Swiper; at 992px and up the CSS turns the
 * wrapper into a 4-up grid and the instance is destroyed (see MenuCards.astro).
 *
 * Slides-per-view tracks the same breakpoints the rest of the site uses
 * (`wf-sm` <=767, `wf-md` <=991 in global.css):
 *   phone  — 1.1, so the next card peeks and the swipe is discoverable
 *   tablet — 2.5, because one card per screen at 768-991px is enormous and
 *            hides how much of the menu there is; the half slide keeps the
 *            peek. `spaceBetween` matches the desktop grid's 24px gap.
 */
const MOBILE = '(max-width: 991px)'
const TABLET = 768

export function initMenuMosaicSwiper() {
  const roots = document.querySelectorAll<HTMLElement>('[data-menu-mosaic-swiper]')
  if (!roots.length) return

  const media = window.matchMedia(MOBILE)
  const instances = new Map<HTMLElement, Swiper>()

  const enable = () => {
    roots.forEach((root) => {
      if (instances.has(root)) return
      instances.set(
        root,
        new Swiper(root, {
          slidesPerView: 1.1,
          spaceBetween: 16,
          grabCursor: true,
          watchOverflow: true,
          simulateTouch: true,
          breakpoints: {
            [TABLET]: { slidesPerView: 2.5, spaceBetween: 24 },
          },
        }),
      )
    })
  }

  const disable = () => {
    instances.forEach((swiper) => swiper.destroy(true, true))
    instances.clear()
  }

  const sync = () => {
    if (media.matches) enable()
    else disable()
  }

  sync()
  media.addEventListener('change', sync)
}
