import GLightbox from 'glightbox'

/**
 * Webflow's native lightbox (`.w-lightbox` + a JSON template) depends on
 * webflow.js, which this port drops. GLightbox replaces it: same click-to-zoom
 * on the bakery story images and the merch product gallery, grouped by
 * `data-gallery` the way Webflow grouped by its JSON `group` key.
 */
export function initLightbox() {
  if (!document.querySelector('.glightbox')) return
  GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true })
}
