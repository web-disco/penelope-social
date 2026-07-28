/**
 * Cloudflare Worker: serves the static build and handles the two form posts.
 *
 * `run_worker_first: ["/api/*"]` in wrangler.jsonc routes only these endpoints
 * here; everything else is served straight from the static assets.
 *
 * The newsletter form does NOT come through here — it posts directly to
 * Mailchimp from the browser (see web/src/scripts/newsletter.ts).
 */
import { sendNotification, verifyTurnstile, type Env } from './email'

const FORMS: Record<string, { subject: string }> = {
  '/api/contact': { subject: 'New contact form submission — penelopesocial.com' },
  '/api/events': { subject: 'New events enquiry — penelopesocial.com' },
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const form = FORMS[url.pathname]

    if (!form) return env.ASSETS.fetch(request)
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const data = await request.formData()

      const token = data.get('cf-turnstile-response')
      const ok = await verifyTurnstile(
        env,
        typeof token === 'string' ? token : null,
        request.headers.get('cf-connecting-ip'),
      )
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

      await sendNotification(env, { subject: form.subject, fields })

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
