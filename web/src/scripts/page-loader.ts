import gsap from 'gsap'
import { lenis } from './lenis'

/**
 * The homepage loader: the logo fades/scales in, then the charcoal panel wipes
 * upward via a clip-path polygon and removes itself. Lenis is paused for the
 * duration. Ported verbatim from the Slater bundle (`fc`).
 */
export function initPageLoader() {
  const loader = document.querySelector('.page-loader')
  if (!loader) return

  lenis.stop()

  gsap.fromTo(
    '.page-loader-logo',
    { opacity: 0, scale: 1.05 },
    {
      opacity: 1,
      scale: 1,
      delay: 0.2,
      onComplete: () => {
        gsap.fromTo(
          loader,
          { 'clip-path': 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' },
          {
            'clip-path': 'polygon(0 0%, 100% 0%, 100% 0, 0 0)',
            ease: 'power4.inOut',
            delay: 0.2,
            duration: 1.3,
            onComplete: () => {
              loader.remove()
              lenis.start()
            },
          },
        )
      },
    },
  )
}
