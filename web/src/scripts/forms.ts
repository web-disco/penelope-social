/**
 * Contact + events forms.
 *
 * Webflow posted these to its own form endpoint and swapped in an inline
 * success/failure message. They now POST to the Cloudflare Worker at
 * `/api/contact` and `/api/events` (see web/worker/index.ts), which verifies
 * Turnstile and emails the submission on. The success/failure UX is unchanged.
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
      if (submit) submit.value = waitValue
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
        if (submit) submit.value = originalValue
      }
    })
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
