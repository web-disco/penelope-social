import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { lenis } from './lenis'
import { initNavbar } from './navbar'
import { initMenu } from './menu'
import { initHomeMenuHover } from './home-menu-hover'
import {
  initTitleAnimation,
  initTextAnimation,
  initFadeIn,
  initStaggerAnimation,
} from './animations'
import { initPageLoader } from './page-loader'
import { initMerchSwiper } from './merch-swiper'
import { initNewsletter } from './newsletter'
import { initSiteForms, initEventForm } from './forms'
import { initLightbox } from './lightbox'
import { initCustomCheckboxes } from './checkbox'

/* Same order as the live site's DOMContentLoaded handler, with the additions
   that replace behaviour webflow.js used to provide (lightbox, checkbox
   visuals) and the form wiring. */
declare global {
  interface Window {
    gsap: typeof gsap
  }
}

function boot() {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  /* GSAP's own CDN build sets this; the ESM build doesn't. Exposing it keeps
     the console (and the parity scripts) able to inspect and settle tweens. */
  window.gsap = gsap
  lenis.start()

  initNavbar()
  initMenu()
  initHomeMenuHover()
  initTitleAnimation()
  initTextAnimation()
  initFadeIn()
  initStaggerAnimation()
  initPageLoader()
  initMerchSwiper()

  // Replaces webflow.js behaviour
  initLightbox()
  initCustomCheckboxes()

  // Forms
  initNewsletter()
  initSiteForms()
  initEventForm()

  ScrollTrigger.refresh()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
