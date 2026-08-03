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
import { initSiteForms, initEventForm, initTurnstileSpacing } from './forms'
import { initLightbox } from './lightbox'

/* Same order as the live site's DOMContentLoaded handler, with the additions
   that replace behaviour webflow.js used to provide (lightbox) and the form
   wiring.

   initCustomCheckboxes() used to sit alongside initLightbox(). Its only consumer
   was the newsletter pop-up's consent checkbox, which is gone. */
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
