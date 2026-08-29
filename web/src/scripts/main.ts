import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { lenis } from './lenis'
import { initHomeMenuHover } from './home-menu-hover'
import {
  initTitleAnimation,
  initTextAnimation,
  initFadeIn,
  initStaggerAnimation,
} from './animations'
import { initMerchSwiper } from './merch-swiper'
import { initSiteForms, initEventForm, initTurnstileSpacing } from './forms'
import { initLightbox } from './lightbox'
import { initAnalyticsClicks } from './ga'
import { initStepByStepTimeline } from './step-timeline'

/* Same order as the live site's DOMContentLoaded handler, with the additions
   that replace behaviour webflow.js used to provide (lightbox) and the form
   wiring. Navbar, drawer, and the page loader used to boot here — the first
   two now live on Navbar.astro, and the loader is gone. */
declare global {
  interface Window {
    gsap: typeof gsap
  }
}

function initReveals() {
  const reveals = document.querySelectorAll('.reveal')
  if (!reveals.length) return

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    reveals.forEach((el) => io.observe(el))
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'))
  }
}

function boot() {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  /* GSAP's own CDN build sets this; the ESM build doesn't. Exposing it keeps
     the console (and the parity scripts) able to inspect and settle tweens. */
  window.gsap = gsap
  lenis.start()
  initStepByStepTimeline()

  initAnalyticsClicks()
  initHomeMenuHover()
  initTitleAnimation()
  initTextAnimation()
  initFadeIn()
  initStaggerAnimation()
  initMerchSwiper()
  initReveals()

  // Replaces webflow.js behaviour
  initLightbox()

  // Forms — the newsletter is one of them now that it posts to the Worker
  // rather than to Mailchimp over JSONP.
  initSiteForms()
  initEventForm()
  initTurnstileSpacing()

  ScrollTrigger.refresh()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
