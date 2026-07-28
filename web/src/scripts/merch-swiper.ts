/**
 * `new Swiper('.swiper.is-merch', { slidesPerView: 1 })` from the Slater bundle.
 *
 * No page currently renders a `.swiper.is-merch` element (the merch gallery is
 * a CSS grid), so on the live site this init is a no-op. It is kept for
 * behavioural parity but Swiper is imported lazily, so the ~150KB of library
 * and CSS is only fetched if such an element actually appears.
 */
export async function initMerchSwiper() {
  if (!document.querySelector('.swiper.is-merch')) return

  const [{ default: Swiper }] = await Promise.all([
    import('swiper'),
    import('swiper/css/bundle'),
  ])

  new Swiper('.swiper.is-merch', { slidesPerView: 1 })
}
