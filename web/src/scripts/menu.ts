import gsap from 'gsap'
import { lenis } from './lenis'

/**
 * The hamburger -> full-screen drawer. Ported verbatim from the Slater bundle
 * (`Rf`): the drawer slides in from `left: -100%`, bars 0 and 2 rotate into an
 * X while bar 1 fades out, and the links stagger up. Lenis is stopped while
 * the drawer is open.
 */
export function initMenu() {
  const toggle = document.querySelector<HTMLElement>('.menu-toggle')
  const drawer = document.querySelector<HTMLElement>('.menu-drawer')
  if (!toggle || !drawer) return

  const bars = toggle.querySelectorAll('.menu-toggle-bar')
  const links = drawer.querySelectorAll('.menu-drawer-link')
  let isOpen = false

  const open = () => {
    const width = window.innerWidth
    gsap.to(drawer, { duration: 0.5, ease: 'expo.inOut', left: 0 })
    gsap.to(bars[0], { duration: 0.3, rotate: 45, y: 6, delay: 0.3 })
    gsap.to(bars[1], { duration: 0.3, autoAlpha: 0, delay: 0.3 })
    gsap.to(bars[2], { duration: 0.3, rotate: -45, y: width > 479 ? -13 : -10, delay: 0.3 })
    gsap.fromTo(
      links,
      { yPercent: 40, opacity: 0, stagger: 0.15 },
      { yPercent: 0, opacity: 1, stagger: 0.085, delay: 0.4 },
    )
  }

  const close = () => {
    gsap.to(drawer, { duration: 0.5, ease: 'expo.inOut', left: '-100%' })
    gsap.to(bars[0], { duration: 0.3, rotate: 0, y: 0, delay: 0.3 })
    gsap.to(bars[1], { duration: 0.3, autoAlpha: 1, delay: 0.3 })
    gsap.to(bars[2], { duration: 0.3, rotate: 0, y: 0, delay: 0.3 })
  }

  toggle.addEventListener('click', () => {
    if (isOpen) {
      close()
      lenis.start()
    } else {
      open()
      lenis.stop()
    }
    isOpen = !isOpen
  })
}
