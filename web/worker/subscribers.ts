/**
 * Newsletter subscribers.
 *
 * The footer form used to POST straight to Mailchimp's `subscribe/post-json`
 * endpoint over JSONP from the browser. Signups now land in D1 instead and are
 * exported as a CSV the client can upload wherever their audience lives.
 *
 * D1 rather than a third-party API because the write happens inside the same
 * Worker that answers the visitor: nothing can fail out of band and drop a
 * signup while the page tells them it worked.
 *
 * This is Penelope's own database (`penelope-social-subscribers`) — separate
 * from Arti's, which the identical code over in that repo talks to.
 */

export type SubscribersEnv = {
  SUBSCRIBERS?: D1Database
  SUBSCRIBERS_USER?: string
  SUBSCRIBERS_PASSWORD?: string
}

/** The footer form is the only way to subscribe; the column allows a second. */
export type SignupSource = 'footer'

/**
 * Record a signup.
 *
 * Returns ok for an address already on the list: from the visitor's side
 * re-subscribing succeeded, and surfacing "you're already subscribed" as an
 * error would just look broken.
 */
export async function addSubscriber(
  db: D1Database,
  { email, consent, ip, source }: {
    email: string
    consent: boolean
    ip: string | null
    source: SignupSource
  }
): Promise<{ ok: boolean; message?: string }> {
  // Normalised so UNIQUE actually dedupes — "A@b.com " and "a@b.com" are the
  // same subscriber.
  const normalised = email.trim().toLowerCase()

  try {
    await db
      .prepare(
        `INSERT INTO subscribers (email, consent, created_at, ip, source)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           -- A repeat signup can only ever grant consent, never revoke it.
           consent = MAX(subscribers.consent, excluded.consent)`
      )
      .bind(normalised, consent ? 1 : 0, new Date().toISOString(), ip, source)
      .run()

    return { ok: true }
  } catch (error) {
    console.error('[subscribers] insert failed', error)
    return { ok: false, message: 'Could not save the subscription' }
  }
}

const csvCell = (value: unknown): string => {
  const text = value === null || value === undefined ? '' : String(value)
  // Quote anything that would otherwise break the row; double internal quotes.
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/**
 * The export.
 *
 * An email-marketing import only needs the email column; consent and timestamp
 * ride along so the list stays CASL-defensible if anyone ever has to show proof
 * of consent.
 */
export async function subscribersCsv(db: D1Database): Promise<string> {
  const { results } = await db
    .prepare(
      `SELECT email, consent, created_at, source
         FROM subscribers
        ORDER BY created_at ASC`
    )
    .all<{ email: string; consent: number; created_at: string; source: string }>()

  const rows = (results ?? []).map((row) =>
    [row.email, row.consent ? 'true' : 'false', row.created_at, row.source].map(csvCell).join(',')
  )

  return ['email,consent,signed_up_at,source', ...rows].join('\n') + '\n'
}

/**
 * HTTP Basic Auth for the export.
 *
 * Basic Auth rather than a `?key=` token: the export is a list of customer
 * email addresses, and a token in the URL ends up in browser history, gets
 * synced across devices, and leaks via the Referer header. The client bookmarks
 * a clean URL and their password manager fills the prompt.
 */
export function checkExportAuth(request: Request, env: SubscribersEnv): Response | null {
  const user = env.SUBSCRIBERS_USER
  const password = env.SUBSCRIBERS_PASSWORD

  if (!user || !password) {
    return new Response(
      'Export is not configured. Set the credentials:\n' +
        '  wrangler secret put SUBSCRIBERS_USER\n' +
        '  wrangler secret put SUBSCRIBERS_PASSWORD\n',
      { status: 503, headers: { 'content-type': 'text/plain' } }
    )
  }

  const header = request.headers.get('authorization') ?? ''
  const [scheme, encoded] = header.split(' ')

  if (scheme === 'Basic' && encoded) {
    let decoded = ''
    try {
      decoded = atob(encoded)
    } catch {
      decoded = ''
    }
    // Split on the FIRST colon only — passwords may contain colons.
    const separator = decoded.indexOf(':')
    if (separator !== -1) {
      const suppliedUser = decoded.slice(0, separator)
      const suppliedPassword = decoded.slice(separator + 1)
      if (timingSafeEqual(suppliedUser, user) && timingSafeEqual(suppliedPassword, password)) {
        return null
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Penelope subscribers", charset="UTF-8"',
      'content-type': 'text/plain',
    },
  })
}

/** Constant-time compare, so a wrong password can't be guessed byte by byte. */
function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder()
  const left = encoder.encode(a)
  const right = encoder.encode(b)
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let i = 0; i < left.length; i++) mismatch |= left[i] ^ right[i]
  return mismatch === 0
}
