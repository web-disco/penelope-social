/**
 * Newsletter submit.
 *
 * Webflow swapped the form for an inline `.w-form-done` / `.w-form-fail`
 * message on submit. Mailchimp's `subscribe/post` endpoint has no CORS, but its
 * `subscribe/post-json` sibling supports a JSONP callback — so we can keep that
 * exact behaviour and still land the subscriber in the list.
 *
 * If this script never runs the form falls back to a plain POST to the
 * `subscribe/post` action, which lands on Mailchimp's own confirmation page.
 */

let callbackId = 0

function jsonp(url: string): Promise<{ result?: string; msg?: string }> {
  return new Promise((resolve, reject) => {
    const name = `__mcCallback${callbackId++}`
    const script = document.createElement('script')
    const timeout = window.setTimeout(() => {
      cleanup()
      reject(new Error('Mailchimp request timed out'))
    }, 10000)

    const cleanup = () => {
      window.clearTimeout(timeout)
      delete (window as any)[name]
      script.remove()
    }

    ;(window as any)[name] = (data: any) => {
      cleanup()
      resolve(data)
    }

    script.src = `${url}&c=${name}`
    script.onerror = () => {
      cleanup()
      reject(new Error('Mailchimp request failed'))
    }
    document.body.appendChild(script)
  })
}

export function initNewsletter() {
  document.querySelectorAll<HTMLFormElement>('form[data-newsletter]').forEach((form) => {
    const action = form.getAttribute('action')
    if (!action) return

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

      const params = new URLSearchParams()
      for (const [key, value] of new FormData(form).entries()) {
        params.append(key, String(value))
      }

      const jsonUrl = action.replace('/subscribe/post?', '/subscribe/post-json?')

      let data: { result?: string; msg?: string }
      try {
        data = await jsonp(`${jsonUrl}&${params.toString()}`)
      } catch {
        /* The JSONP endpoint was unreachable (network error, or the account has
           post-json disabled). Don't claim failure when we simply couldn't ask:
           fall back to a native POST so the subscriber still reaches Mailchimp's
           own confirmation page. */
        if (submit) submit.value = originalValue
        form.submit()
        return
      }

      if (data.result === 'success') {
        form.style.display = 'none'
        if (done) done.style.display = 'block'
      } else if (fail) {
        /* A real validation error from Mailchimp (already-subscribed, bad
           address). Webflow showed a generic message here; keep that, but log
           the specific reason for anyone debugging. */
        if (data.msg) console.warn('[newsletter]', data.msg)
        fail.style.display = 'block'
      }
      if (submit) submit.value = originalValue
    })
  })
}
