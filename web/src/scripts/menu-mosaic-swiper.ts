import Swiper from 'swiper'
import 'swiper/css'

const MOBILE = '(max-width: 991px)'

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
