import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { lenis } from './lenis'
import { initHomeMenuHover } from './home-menu-hover'
import { initMerchSwiper } from './merch-swiper'
import { initSiteForms, initEventForm, initTurnstileSpacing } from './forms'
import { initLightbox } from './lightbox'
import { initAnalyticsClicks } from './ga'
import { initStepByStepTimeline } from './step-timeline'

/* Same order as the live site's DOMContentLoaded handler, with the additions
   that replace behaviour webflow.js used to provide (lightbox) and the form
   wiring. Navbar, drawer, and the page loader used to boot here — the first
   two now live on Navbar.astro, and the loader is gone.
   Fade / SplitText / .reveal hides are gone so first paint is visible. */
declare global {
  interface Window {
    gsap: typeof gsap
  }
}

function boot() {
  gsap.registerPlugin(ScrollTrigger)
  window.gsap = gsap
  lenis.start()
  initStepByStepTimeline()

  initAnalyticsClicks()
  initHomeMenuHover()
  initMerchSwiper()

  initLightbox()

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
