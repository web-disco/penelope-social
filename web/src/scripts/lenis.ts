import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/** Matches the live site: `new Lenis({ autoRaf: true, touchMultiplier: 0 })`. */
export const lenis = new Lenis({ autoRaf: true, touchMultiplier: 0 })

/* Exposed so tooling (and the parity scripts) can drive scroll position
   without fighting the smooth-scroll loop. */
declare global {
  interface Window {
    lenis: Lenis
  }
}
window.lenis = lenis
