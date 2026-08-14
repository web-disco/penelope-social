/**
 * Pluggable email sender for the contact and events forms.
 *
 * The Webflow site delivered submissions through Webflow's own form handling,
 * which doesn't come with us. Three providers sit behind `EMAIL_PROVIDER`:
 *
 *   postmark    POST to api.postmarkapp.com with POSTMARK_SERVER_TOKEN
 *   cloudflare  the EMAIL binding (Cloudflare Email Service)
 *   resend      POST to api.resend.com with RESEND_API_KEY
 *   (unset)     no email is sent and the submission still succeeds
 *
 * Flipping the env var is the whole switch — no code change.
 *
 * `NOTIFY_EMAIL_TO` is a comma-separated list, not one address. Postmark and
 * Resend both take several recipients in a single API call; the Cloudflare
 * binding takes exactly one, so that path sends one message per recipient and
 * they cannot see each other. Whichever provider is in use, a recipient that
 * fails does not stop the rest — see `sendNotification`.
 *
 * The `cloudflare` path used to build a MIME message with `mimetext` and hand it
 * to Email Routing's old `send_email` API, which is why the Worker carried the
 * `nodejs_compat` flag. Email Service takes a plain object now, so both the
 * dependency and the flag are gone.
 *
 * IMPORTANT: the sender address must be one the provider has verified. Postmark
 * needs `NOTIFY_EMAIL_FROM`'s domain confirmed under Sender Signatures (DKIM +
 * Return-Path DNS records); Cloudflare Email Service needs the domain onboarded,
 * and until it is, every send fails with `email.sending.error.email.invalid`.
 * Either way a failure here is logged loudly with the whole submission but never
 * fails the visitor's request. See worker/index.ts.
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
  POSTMARK_SERVER_TOKEN?: string
  RESEND_API_KEY?: string
  /** Comma-separated; every address gets a copy. */
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

/*
 * The field names are the Webflow input names the migration preserved
 * (`Event-Form-Last-Name`), which is fine as an HTML `name` and unreadable in an
 * inbox. Both forms use the same suffixes behind a `Contact-Form-`/`Event-Form-`
 * prefix, so the prefix is stripped and the remainder looked up here — one entry
 * covers the same field on both forms.
 *
 * Not the `placeholder` from the Sanity field definition, which is the obvious
 * alternative: those are written as prompts, so the message field would label
 * itself "Leave a message!". Not sent from the client either — the label would
 * then be attacker-controlled, and a POST could put whatever it liked in front
 * of the value in the client's inbox.
 */
const FIELD_LABELS: Record<string, string> = {
  Name: 'First Name',
  'Last-Name': 'Last Name',
  Email: 'Email',
  Phone: 'Phone',
  'Reason-For-Inquiry': 'Inquiry',
  'Amount-of-Guests': 'Number of Guests',
  Date: 'Date',
  Message: 'Message',
}

/** `Event-Form-Last-Name` -> `Last Name`; unknown names de-kebab themselves. */
export function labelFor(name: string): string {
  const bare = name.replace(/^(?:Contact|Event)-Form-/, '')
  return FIELD_LABELS[bare] ?? bare.replace(/-/g, ' ')
}

function asText(submission: Submission): string {
  return Object.entries(submission.fields)
    /* Optional fields left blank are dropped rather than printed as a bare
       "Phone:" — an empty line says nothing the client can act on. */
    .filter(([, value]) => value.trim() !== '')
    .map(([key, value]) => `${labelFor(key)}: ${value.trim()}`)
    .join('\n')
}

export async function sendNotification(env: Env, submission: Submission): Promise<void> {
  const provider = env.EMAIL_PROVIDER
  if (!provider) return

  const recipients = (env.NOTIFY_EMAIL_TO ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
  const from = env.NOTIFY_EMAIL_FROM
  if (recipients.length === 0 || !from) {
    console.warn('[forms] EMAIL_PROVIDER is set but NOTIFY_EMAIL_TO/FROM are not; skipping email')
    return
  }

  if (provider === 'postmark') {
    if (!env.POSTMARK_SERVER_TOKEN) {
      console.warn('[forms] EMAIL_PROVIDER=postmark but POSTMARK_SERVER_TOKEN is missing')
      return
    }
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        From: from,
        To: recipients.join(', '),
        Subject: submission.subject,
        TextBody: asText(submission),
        /* The transactional stream. Postmark rejects a send whose stream does
           not exist, and silently routing form notifications through a
           broadcast stream would subject them to bulk-send throttling and an
           unsubscribe footer. */
        MessageStream: 'outbound',
        ...(submission.replyTo ? { ReplyTo: submission.replyTo } : {}),
      }),
    })
    /* Postmark reports most failures as a non-2xx with an `ErrorCode`, but a
       partial failure across several recipients comes back 200 with a non-zero
       code — so checking the status alone would call a dropped notification a
       success. */
    const result = (await response.json().catch(() => null)) as {
      ErrorCode?: number
      Message?: string
    } | null
    if (!response.ok || (result?.ErrorCode ?? 0) !== 0) {
      throw new Error(
        `Postmark rejected the message: ${response.status} ${result?.ErrorCode ?? '?'} ${result?.Message ?? ''}`,
      )
    }
    return
  }

  if (provider === 'cloudflare') {
    if (!env.EMAIL) {
      console.warn('[forms] EMAIL_PROVIDER=cloudflare but the EMAIL binding is missing')
      return
    }
    /* One message per recipient: the binding takes a single `to`. Sent in
       sequence and collected rather than short-circuited, so one bad address
       cannot swallow the notification for every other. */
    const failures: unknown[] = []
    for (const to of recipients) {
      try {
        await env.EMAIL.send({
          to,
          from,
          subject: submission.subject,
          text: asText(submission),
          ...(submission.replyTo ? { replyTo: submission.replyTo } : {}),
        })
      } catch (error) {
        failures.push(error)
      }
    }
    if (failures.length > 0) {
      throw new Error(
        `Email Service rejected ${failures.length}/${recipients.length} recipients: ${failures.join('; ')}`,
      )
    }
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
        to: recipients,
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
