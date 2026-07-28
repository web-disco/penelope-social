import gsap from 'gsap'

/**
 * Hide the navbar when scrolling down, reveal it when scrolling up, and fade a
 * translucent charcoal backdrop in past 100px.
 *
 * Ported verbatim from the site's Slater bundle (`Ef`), including its use of
 * `document.body.getBoundingClientRect().top` as the scroll-direction probe.
 */
export function initNavbar() {
  let lastTop = 0
  const navbar = document.querySelector('.navbar')
  if (!navbar) return

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY

    if (document.body.getBoundingClientRect().top > lastTop) {
      gsap.to(navbar, { yPercent: 0 })
    } else {
      gsap.to(navbar, { yPercent: -100 })
    }
    lastTop = document.body.getBoundingClientRect().top

    if (scrollY > 100) {
      gsap.to(navbar, {
        background: 'rgba(40, 38, 41, 0.75)',
        backdropFilter: 'blur(10px)',
        ease: 'none',
        duration: 0.3,
      })
    } else {
      gsap.to(navbar, {
        background: 'rgba(40, 38, 41, 0)',
        backdropFilter: 'blur(0px)',
        ease: 'none',
        duration: 0.3,
      })
    }
  })
}
