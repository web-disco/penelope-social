/**
 * Pluggable email sender.
 *
 * The Webflow site delivered form submissions through Webflow's own form
 * handling, which doesn't come with us. Rather than hardcode a provider before
 * the client has picked one, both options sit behind `EMAIL_PROVIDER`:
 *
 *   resend      POST to api.resend.com with RESEND_API_KEY
 *   cloudflare  the SEND_EMAIL binding (Cloudflare Email Routing)
 *   (unset)     no email is sent and the submission still succeeds
 *
 * Flipping the env var is the whole switch — no code change at go-live.
 */
export interface Env {
  EMAIL_PROVIDER?: string
  RESEND_API_KEY?: string
  NOTIFY_EMAIL_TO?: string
  NOTIFY_EMAIL_FROM?: string
  SEND_EMAIL?: { send(message: unknown): Promise<void> }
  TURNSTILE_SECRET_KEY?: string
  ASSETS: { fetch(request: Request): Promise<Response> }
}

export interface Submission {
  subject: string
  fields: Record<string, string>
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
      body: JSON.stringify({ from, to: [to], subject: submission.subject, text: asText(submission) }),
    })
    if (!response.ok) {
      console.error('[forms] Resend rejected the message', response.status, await response.text())
    }
    return
  }

  if (provider === 'cloudflare') {
    if (!env.SEND_EMAIL) {
      console.warn('[forms] EMAIL_PROVIDER=cloudflare but the SEND_EMAIL binding is missing')
      return
    }
    // `mimetext` needs the nodejs_compat flag, which wrangler.jsonc sets.
    const { createMimeMessage } = await import('mimetext')
    const { EmailMessage } = await import('cloudflare:email')

    const message = createMimeMessage()
    message.setSender({ addr: from })
    message.setRecipient(to)
    message.setSubject(submission.subject)
    message.addMessage({ contentType: 'text/plain', data: asText(submission) })

    await env.SEND_EMAIL.send(new EmailMessage(from, to, message.asRaw()))
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
