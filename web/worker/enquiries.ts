/**
 * Contact and events submissions, stored alongside the newsletter subscribers.
 *
 * The email notification is a *notification*, not the record. It can fail, land
 * in spam, or be deleted from someone's inbox, and until a domain is onboarded
 * to Email Service it cannot be sent at all. An enquiry about a catering
 * booking is worth more than that, so it is written here first and emailed
 * second.
 */

export type EnquiryForm = 'contact' | 'events'

export type EnquiriesEnv = {
  ENQUIRIES?: D1Database
}

/**
 * Store a submission and return its id, or null if the write failed.
 *
 * The id is what lets the caller come back and mark the row notified once the
 * email is away. Returning null rather than throwing: the caller has already
 * decided that nothing here should cost the visitor their submission.
 */
export async function addEnquiry(
  db: D1Database,
  { form, fields, ip }: { form: EnquiryForm; fields: Record<string, string>; ip: string | null }
): Promise<number | null> {
  /* Best-effort scan columns. Both forms prefix their fields ("Contact-Form-",
     "Event-Form-"), so match on the suffix and let either shape work. */
  const pick = (suffix: string) => {
    const key = Object.keys(fields).find((k) => k.toLowerCase().endsWith(suffix))
    return key ? fields[key] : undefined
  }
  const first = pick('form-name')
  const last = pick('form-last-name')
  const name = [first, last].filter(Boolean).join(' ') || null

  try {
    const result = await db
      .prepare(
        `INSERT INTO enquiries (form, created_at, name, email, payload, ip)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        form,
        new Date().toISOString(),
        name,
        pick('form-email') ?? null,
        JSON.stringify(fields),
        ip
      )
      .run()

    const id = result.meta?.last_row_id
    return typeof id === 'number' ? id : null
  } catch (error) {
    console.error('[enquiries] insert failed', error)
    return null
  }
}

/** Record that the notification for this enquiry actually went out. */
export async function markNotified(db: D1Database, id: number): Promise<void> {
  try {
    await db.prepare('UPDATE enquiries SET notified = 1 WHERE id = ?').bind(id).run()
  } catch (error) {
    /* The enquiry is stored and the email was sent — the flag is bookkeeping.
       Worth a log, not worth failing anything. */
    console.error('[enquiries] could not mark notified', id, error)
  }
}

const csvCell = (value: unknown): string => {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/**
 * The export.
 *
 * One column per known field rather than a JSON blob in a cell: the point of
 * the export is that someone can open it in a spreadsheet and read it. The
 * header is built from the union of every row's fields, so a form that gains a
 * field later still exports cleanly and old rows just leave it blank.
 */
export async function enquiriesCsv(db: D1Database): Promise<string> {
  const { results } = await db
    .prepare(
      `SELECT id, form, created_at, notified, ip, payload
         FROM enquiries
        ORDER BY created_at ASC`
    )
    .all<{
      id: number
      form: string
      created_at: string
      notified: number
      ip: string | null
      payload: string
    }>()

  const rows = (results ?? []).map((row) => {
    let fields: Record<string, string> = {}
    try {
      fields = JSON.parse(row.payload)
    } catch {
      /* Unparseable payload still exports its metadata rather than vanishing. */
    }
    return { ...row, fields }
  })

  const fieldNames: string[] = []
  for (const row of rows) {
    for (const key of Object.keys(row.fields)) {
      if (!fieldNames.includes(key)) fieldNames.push(key)
    }
  }

  const header = ['id', 'form', 'submitted_at', 'emailed', 'ip', ...fieldNames]
  const lines = rows.map((row) =>
    [
      row.id,
      row.form,
      row.created_at,
      row.notified ? 'true' : 'false',
      row.ip ?? '',
      ...fieldNames.map((name) => row.fields[name] ?? ''),
    ]
      .map(csvCell)
      .join(',')
  )

  return [header.map(csvCell).join(','), ...lines].join('\n') + '\n'
}
