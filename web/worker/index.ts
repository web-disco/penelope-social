/**
 * Cloudflare Worker: serves the static build and handles the form posts.
 *
 * `run_worker_first: ["/api/*"]` in wrangler.jsonc routes only these endpoints
 * here; everything else is served straight from the static assets.
 *
 *   POST /api/contact         → email notification
 *   POST /api/events          → email notification
 *   POST /api/newsletter      → store the footer signup in D1
 *   GET  /api/subscribers.csv → export, behind Basic Auth
 */
import { sendNotification, verifyTurnstile, type Env as EmailEnv } from './email'
import {
  addSubscriber,
  checkExportAuth,
  subscribersCsv,
  type SubscribersEnv,
} from './subscribers'

type Env = EmailEnv & SubscribersEnv

const FORMS: Record<string, { subject: string }> = {
  '/api/contact': { subject: 'New contact form submission — penelopesocial.com' },
  '/api/events': { subject: 'New events enquiry — penelopesocial.com' },
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/newsletter') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
      if (!env.SUBSCRIBERS) return json({ error: 'Subscriber storage is not configured' }, 503)

      const data = await request.formData()
      const ip = request.headers.get('cf-connecting-ip')

      const token = data.get('cf-turnstile-response')
      if (!(await verifyTurnstile(env, typeof token === 'string' ? token : null, ip))) {
        return json({ error: 'Captcha verification failed' }, 400)
      }

      const email = String(data.get('email') ?? '').trim()
      if (!email || !email.includes('@')) return json({ error: 'A valid email is required' }, 400)

      // The footer checkbox is `required`, so this only fires on a direct POST.
      // Rejecting rather than storing `consent: false` — the endpoint is public,
      // and a subscriber row the client can never legally email is worse than no
      // row at all. CASL wants proof, not an inference.
      if (data.get('consent') === null) {
        return json({ error: 'Please agree to receive marketing emails' }, 400)
      }

      // `consent` is always true past the guard above; the column stays because
      // it is the audit trail — the export has to show consent per row. Same for
      // `source`: only the footer form can reach this today.
      const result = await addSubscriber(env.SUBSCRIBERS, {
        email,
        consent: true,
        ip,
        source: 'footer',
      })
      return result.ok ? json({ ok: true }) : json({ error: result.message }, 500)
    }

    if (url.pathname === '/api/subscribers.csv') {
      if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

      const unauthorised = checkExportAuth(request, env)
      if (unauthorised) return unauthorised

      if (!env.SUBSCRIBERS) return json({ error: 'Subscriber storage is not configured' }, 503)

      const csv = await subscribersCsv(env.SUBSCRIBERS)
      const stamp = new Date().toISOString().slice(0, 10)
      return new Response(csv, {
        headers: {
          'content-type': 'text/csv; charset=utf-8',
          'content-disposition': `attachment; filename="penelope-subscribers-${stamp}.csv"`,
          // A list of customer emails should never be cached anywhere.
          'cache-control': 'no-store',
        },
      })
    }

    const form = FORMS[url.pathname]

    if (!form) return env.ASSETS.fetch(request)
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const data = await request.formData()

      const ip = request.headers.get('cf-connecting-ip')
      const token = data.get('cf-turnstile-response')
      const ok = await verifyTurnstile(env, typeof token === 'string' ? token : null, ip)
      if (!ok) {
        return new Response(JSON.stringify({ error: 'Captcha verification failed' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        })
      }

      const fields: Record<string, string> = {}
      for (const [key, value] of data.entries()) {
        if (key === 'cf-turnstile-response') continue
        if (typeof value === 'string') fields[key] = value
      }

      /*
       * Both forms name their email field `<Form>-Form-Email`; whichever is
       * present becomes the Reply-To, so the client answers the enquirer
       * directly instead of the site's own sending address.
       */
      const replyTo = fields['Event-Form-Email'] || fields['Contact-Form-Email'] || undefined

      /*
       * A failed notification must not fail the visitor's submission.
       *
       * Sending is the part most likely to break for reasons that have nothing
       * to do with them — an unonboarded sending domain, a provider outage, a
       * revoked key — and telling someone their enquiry failed when we merely
       * couldn't forward it loses it twice: they don't retry, and we have no
       * other copy.
       *
       * The log IS that other copy, and it is the only one: contact and events
       * submissions are deliberately not stored (see the newsletter endpoint
       * above for the one thing that is). Workers logs are retained for days,
       * not forever, so a notification that fails unnoticed for a week is an
       * enquiry gone. Watch for this line.
       */
      try {
        await sendNotification(env, { subject: form.subject, fields, replyTo })
      } catch (error) {
        console.error(
          `[forms] notification failed for ${url.pathname} — submission follows so it is not lost`,
          JSON.stringify(fields),
          error,
        )
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'content-type': 'application/json' },
      })
    } catch (error) {
      console.error('[forms] submission failed', error)
      return new Response(JSON.stringify({ error: 'Submission failed' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      })
    }
  },
}
