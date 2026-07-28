import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

/**
 * The four scroll-triggered animations from the Slater bundle, ported verbatim.
 *
 * `[title-animation]` and `[text-animation]` (SplitText) are not currently used
 * by any page's markup — they are kept so the attributes keep working if an
 * editor adds them, exactly as on the live site.
 * `[fade-in]` is used on /about, `[stagger-animation]` on the merch detail pages.
 */

/** `[title-animation]` — per-character rise, re-split on width change. */
export function initTitleAnimation() {
  const targets = document.querySelectorAll<HTMLElement>('[title-animation]')
  const splits = new Map<HTMLElement, SplitText>()

  const split = (el: HTMLElement) => {
    splits.set(el, new SplitText(el, { type: 'chars', charsClass: 'char' }))
  }

  targets.forEach((el) => {
    split(el)
    let width = window.innerWidth
    window.addEventListener('resize', () => {
      if (width !== window.innerWidth) {
        width = window.innerWidth
        splits.get(el)?.revert()
        split(el)
      }
    })

    gsap.fromTo(
      el.querySelectorAll('.char'),
      { yPercent: 50, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    )
  })
}

/** `[text-animation]` — per-line rise. */
export function initTextAnimation() {
  const targets = document.querySelectorAll<HTMLElement>('[text-animation]')
  const splits = new Map<HTMLElement, SplitText>()

  const split = (el: HTMLElement) => {
    splits.set(el, new SplitText(el, { type: 'lines', linesClass: 'line' }))
  }

  targets.forEach((el) => {
    split(el)
    let width = window.innerWidth
    window.addEventListener('resize', () => {
      if (width !== window.innerWidth) {
        width = window.innerWidth
        splits.get(el)?.revert()
        split(el)
      }
    })

    gsap.fromTo(
      el.querySelectorAll('.line'),
      { yPercent: 50, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.13,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    )
  })
}

/** `[fade-in]` — fade + 10% rise. */
export function initFadeIn() {
  document.querySelectorAll<HTMLElement>('[fade-in]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, yPercent: 10 },
      {
        yPercent: 0,
        opacity: 1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    )
  })
}

/** `[stagger-animation]` — children rise, staggered on desktop, one-by-one below 991px. */
export function initStaggerAnimation() {
  const targets = document.querySelectorAll<HTMLElement>('[stagger-animation]')
  const mm = gsap.matchMedia()

  targets.forEach((el) => {
    mm.add('screen and (min-width: 991px)', () => {
      gsap.from(el.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.13,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    })

    mm.add('screen and (max-width: 990px)', () => {
      Array.from(el.children).forEach((child) => {
        gsap.from(child, {
          y: 25,
          opacity: 0,
          duration: 1,
          scrollTrigger: { trigger: child, start: 'top 85%' },
        })
      })
    })
  })
}
