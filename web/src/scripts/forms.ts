/**
 * Every form on the site — contact, events, and the footer newsletter.
 *
 * Webflow posted these to its own form endpoint and swapped in an inline
 * success/failure message. They now POST to the Cloudflare Worker (see
 * web/worker/index.ts), which verifies Turnstile and then either emails the
 * submission on (`/api/contact`, `/api/events`) or stores the subscriber in D1
 * (`/api/newsletter`). The success/failure UX is unchanged.
 */
export function initSiteForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-endpoint]').forEach((form) => {
    const endpoint = form.getAttribute('data-endpoint')!
    const block = form.parentElement
    const done = block?.querySelector<HTMLElement>('.w-form-done')
    const fail = block?.querySelector<HTMLElement>('.w-form-fail')
    const submit = form.querySelector<HTMLInputElement>('input[type=submit]')
    const originalValue = submit?.value ?? ''
    const waitValue = submit?.getAttribute('data-wait') ?? 'Please wait...'

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      if (submit) {
        submit.value = waitValue
        submit.disabled = true
      }
      if (fail) fail.style.display = 'none'

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
        })
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)

        form.style.display = 'none'
        if (done) done.style.display = 'block'
      } catch {
        if (fail) fail.style.display = 'block'
      } finally {
        if (submit) {
          submit.value = originalValue
          submit.disabled = false
        }
        resetTurnstile(form)
      }
    })
  })
}

/**
 * Issue a fresh Turnstile token for the next attempt.
 *
 * Turnstile tokens are single-use and the widget does not renew one by itself.
 * Without this, a visitor whose first submit fails for ANY reason — a network
 * blip, a validation error, a 500 — sends the same spent token on their second
 * attempt and gets "Captcha verification failed" from then on, with nothing to
 * do about it but reload the page. The retry path is exactly when a form must
 * not break.
 *
 * Guarded on every side: there is no widget when the sitekey is unset, and the
 * script is third-party so it may be blocked or still loading.
 */
function resetTurnstile(form: HTMLFormElement) {
  const widget = form.querySelector<HTMLElement>('.cf-turnstile')
  if (!widget) return

  const turnstile = (window as any).turnstile
  if (!turnstile?.reset) return

  try {
    turnstile.reset(widget)
  } catch {
    // A widget that was never rendered throws; nothing to recover.
  }
}

/**
 * Give a Turnstile slot spacing only while the widget is on screen.
 *
 * The widget is `interaction-only`, so for nearly every visitor it measures 0x0
 * and there is nothing to space away from. A static margin would therefore push
 * the submit button down permanently for a challenge almost nobody is shown.
 *
 * There is no CSS hook for this: hidden and visible widgets have identical
 * markup — same children, no inline styles, no iframe, no shadow root — and
 * differ only in computed height, which no selector can test. Hence measuring.
 * ResizeObserver rather than polling, since the only thing that changes the
 * size is Cloudflare rendering or clearing the challenge.
 */
export function initTurnstileSpacing() {
  if (typeof ResizeObserver === 'undefined') return

  document.querySelectorAll<HTMLElement>('[data-turnstile-slot]').forEach((slot) => {
    const widget = slot.querySelector<HTMLElement>('.cf-turnstile')
    if (!widget) return

    const sync = () =>
      slot.classList.toggle('is-visible', widget.getBoundingClientRect().height > 0)

    new ResizeObserver(sync).observe(widget)
    sync()
  })
}

/**
 * Preselect the enquiry reason from the query string, e.g. the "Catering &
 * Events" nav link points at `/catering-events?general-inquiry`.
 *
 * The live site ships this as an inline script but targets `#Event-Type`, an id
 * that does not exist on the page (the select is `#Reason-For-Inquiry`), so it
 * silently does nothing there. Pointing it at the real select makes the
 * behaviour the links clearly intend actually work.
 */
export function initEventForm() {
  const eventForm = document.querySelector('#events-form')
  if (!eventForm) return

  const select = document.querySelector<HTMLSelectElement>('#Reason-For-Inquiry')
  if (!select) return

  const params = new URLSearchParams(window.location.search)
  const firstKey = Array.from(params.keys())[0] // e.g. "general-inquiry"
  if (!firstKey) return

  const normalized = firstKey.replace(/-/g, ' ').toLowerCase()
  for (const option of Array.from(select.options)) {
    if (option.value.toLowerCase() === normalized) {
      select.value = option.value
      break
    }
  }
}
