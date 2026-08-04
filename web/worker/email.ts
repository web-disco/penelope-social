/**
 * Pluggable email sender for the contact and events forms.
 *
 * The Webflow site delivered submissions through Webflow's own form handling,
 * which doesn't come with us. Two providers sit behind `EMAIL_PROVIDER`:
 *
 *   cloudflare  the EMAIL binding (Cloudflare Email Service)
 *   resend      POST to api.resend.com with RESEND_API_KEY
 *   (unset)     no email is sent and the submission still succeeds
 *
 * Flipping the env var is the whole switch — no code change.
 *
 * The `cloudflare` path used to build a MIME message with `mimetext` and hand it
 * to Email Routing's old `send_email` API, which is why the Worker carried the
 * `nodejs_compat` flag. Email Service takes a plain object now, so both the
 * dependency and the flag are gone.
 *
 * IMPORTANT: the sender address must belong to a domain onboarded to Email
 * Service. Until one is, every send fails with
 * `email.sending.error.email.invalid` — which is why a failure here is logged
 * loudly with the whole submission but never fails the visitor's request. See
 * worker/index.ts.
 */

/** The subset of the Email Service binding this Worker uses. */
export interface EmailBinding {
  send(message: {
    to: string
    from: string
    subject: string
    text?: string
    html?: string
    replyTo?: string
  }): Promise<unknown>
}

export interface Env {
  EMAIL_PROVIDER?: string
  RESEND_API_KEY?: string
  NOTIFY_EMAIL_TO?: string
  NOTIFY_EMAIL_FROM?: string
  EMAIL?: EmailBinding
  TURNSTILE_SECRET_KEY?: string
  ASSETS: { fetch(request: Request): Promise<Response> }
}

export interface Submission {
  subject: string
  fields: Record<string, string>
  /**
   * The enquirer's own address, so the client can just hit reply. Without it
   * every reply goes back to the site's own sending address, which nobody
   * reads.
   */
  replyTo?: string
}

function asText(submission: Submission): string {
  return Object.entries(submission.fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

export async function sendNotification(env: Env, submission: Submission): Promise<void> {
  const provider = env.EMAIL_PROVIDER
  if (!provider) return

  const to = env.NOTIFY_EMAIL_TO
  const from = env.NOTIFY_EMAIL_FROM
  if (!to || !from) {
    console.warn('[forms] EMAIL_PROVIDER is set but NOTIFY_EMAIL_TO/FROM are not; skipping email')
    return
  }

  if (provider === 'cloudflare') {
    if (!env.EMAIL) {
      console.warn('[forms] EMAIL_PROVIDER=cloudflare but the EMAIL binding is missing')
      return
    }
    await env.EMAIL.send({
      to,
      from,
      subject: submission.subject,
      text: asText(submission),
      ...(submission.replyTo ? { replyTo: submission.replyTo } : {}),
    })
    return
  }

  if (provider === 'resend') {
    if (!env.RESEND_API_KEY) {
      console.warn('[forms] EMAIL_PROVIDER=resend but RESEND_API_KEY is missing')
      return
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: submission.subject,
        text: asText(submission),
        ...(submission.replyTo ? { reply_to: submission.replyTo } : {}),
      }),
    })
    /* Throw rather than log-and-continue: the caller decides what a failed
       notification means for the visitor, and it needs to know one happened. */
    if (!response.ok) {
      throw new Error(`Resend rejected the message: ${response.status} ${await response.text()}`)
    }
    return
  }

  console.warn(`[forms] unknown EMAIL_PROVIDER "${provider}"`)
}

/** Verifies a Turnstile token; passes through when no secret is configured. */
export async function verifyTurnstile(env: Env, token: string | null, ip: string | null) {
  if (!env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false

  const body = new FormData()
  body.append('secret', env.TURNSTILE_SECRET_KEY)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  const result = (await response.json()) as { success?: boolean }
  return Boolean(result.success)
}
