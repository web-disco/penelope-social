#!/usr/bin/env node
/**
 * Local proof that the contact and events forms still deliver, without
 * touching the network or a real inbox.
 *
 *   node web/worker/__verify__/form-submit.mjs
 *
 * Bundles web/worker/index.ts with the esbuild already in node_modules (it
 * ships with Astro/wrangler; nothing to install), runs it in Node with a stub
 * env (EMAIL_PROVIDER=postmark, fake token, no TURNSTILE_SECRET_KEY so
 * verifyTurnstile passes) and a stubbed global fetch that records the Postmark
 * request instead of sending it. Exits non-zero if any case fails.
 *
 * NEVER point this at the live site or a preview: production Postmark mails
 * the client's real inboxes.
 */
import { createRequire } from 'node:module'
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')

/** esbuild is a transitive dependency, so it may only be reachable through .pnpm. */
function loadEsbuild() {
  const require = createRequire(import.meta.url)
  try {
    return require('esbuild')
  } catch {
    const store = path.join(root, 'node_modules/.pnpm')
    const dir = existsSync(store) && readdirSync(store).find((d) => /^esbuild@\d/.test(d))
    if (!dir) throw new Error('esbuild not found. Run `pnpm install --frozen-lockfile` first.')
    return require(path.join(store, dir, 'node_modules/esbuild'))
  }
}

const out = mkdtempSync(path.join(tmpdir(), 'ps-worker-verify-'))
const bundle = path.join(out, 'worker.mjs')
loadEsbuild().buildSync({
  entryPoints: [path.join(root, 'web/worker/index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  outfile: bundle,
  logLevel: 'error',
})
const worker = (await import(pathToFileURL(bundle).href)).default
rmSync(out, { recursive: true, force: true })

/* Every outgoing request is recorded; nothing leaves the machine. */
const calls = []
globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url
  calls.push({ url, init })
  if (url === 'https://api.postmarkapp.com/email') {
    return new Response(JSON.stringify({ ErrorCode: 0, Message: 'OK' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }
  throw new Error(`Unexpected network call to ${url}`)
}

const env = {
  EMAIL_PROVIDER: 'postmark',
  POSTMARK_SERVER_TOKEN: 'fake-token',
  NOTIFY_EMAIL_TO: 'leads@example.test',
  NOTIFY_EMAIL_FROM: 'forms@example.test',
  ASSETS: { fetch: async () => new Response('asset', { status: 200 }) },
}

const eventFields = (reason) => ({
  'Event-Form-Name': 'Ada',
  'Event-Form-Last-Name': 'Lovelace',
  'Event-Form-Email': 'ada@example.test',
  'Event-Form-Phone': '905 555 0100',
  'Reason-For-Inquiry': reason,
  'Event-Form-Amount-of-Guests': '24',
  Date: '2026-12-12',
  'Event-Form-Message': 'Holiday party for the office.',
})

const cases = [
  {
    name: '(a) /api/events, Event, no catering-notice field',
    path: '/api/events',
    fields: eventFields('Event'),
    expect: ['First Name: Ada', 'Last Name: Lovelace', 'Email: ada@example.test', 'Phone: 905 555 0100', 'Inquiry: Event', 'Number of Guests: 24', 'Date: 2026-12-12', 'Message: Holiday party for the office.'],
    reject: ['catering-notice', 'catering notice'],
  },
  {
    name: '(b) /api/events, General Inquiry',
    path: '/api/events',
    fields: eventFields('General Inquiry'),
    expect: ['Inquiry: General Inquiry', 'Email: ada@example.test'],
    reject: ['catering notice'],
  },
  {
    name: '(c) /api/events, stale cached page: Catering + catering-notice=yes (lead still delivered)',
    path: '/api/events',
    fields: { ...eventFields('Catering'), 'catering-notice': 'yes' },
    expect: ['Inquiry: Catering', 'catering notice: yes'],
  },
  {
    name: '(d) /api/contact',
    path: '/api/contact',
    fields: {
      'Contact-Form-Name': 'Grace',
      'Contact-Form-Last-Name': 'Hopper',
      'Contact-Form-Email': 'grace@example.test',
      'Contact-Form-Phone': '',
      'Contact-Form-Message': 'Do you have gluten-free options?',
    },
    expect: ['First Name: Grace', 'Email: grace@example.test', 'Message: Do you have gluten-free options?'],
    reject: ['Phone:'],
  },
]

let failed = 0
for (const c of cases) {
  calls.length = 0
  const body = new FormData()
  for (const [k, v] of Object.entries(c.fields)) body.append(k, v)
  const res = await worker.fetch(new Request(`https://local.test${c.path}`, { method: 'POST', body }), env)
  const json = await res.json()
  const postmark = calls.filter((call) => call.url === 'https://api.postmarkapp.com/email')
  const sent = postmark[0] ? JSON.parse(postmark[0].init.body) : {}
  const text = sent.TextBody ?? ''
  const problems = []
  if (res.status !== 200 || json.ok !== true) problems.push(`response ${res.status} ${JSON.stringify(json)}`)
  if (postmark.length !== 1 || calls.length !== 1) problems.push(`expected exactly 1 Postmark call, got ${postmark.length} (of ${calls.length})`)
  for (const line of c.expect) if (!text.includes(line)) problems.push(`TextBody missing "${line}"`)
  for (const line of c.reject ?? []) if (text.includes(line)) problems.push(`TextBody should not contain "${line}"`)
  if (postmark[0] && postmark[0].init.headers['X-Postmark-Server-Token'] !== 'fake-token') problems.push('wrong token header')

  console.log(`${problems.length ? 'FAIL' : 'PASS'} ${c.name}`)
  console.log(`  -> ${res.status} ${JSON.stringify(json)}; Postmark calls: ${postmark.length}; To: ${sent.To}; ReplyTo: ${sent.ReplyTo}; Subject: ${sent.Subject}`)
  console.log(text.split('\n').map((l) => `     | ${l}`).join('\n'))
  for (const p of problems) console.log(`  !! ${p}`)
  if (problems.length) failed++
}

console.log(failed ? `\n${failed} case(s) failed` : `\nAll ${cases.length} cases passed`)
process.exit(failed ? 1 : 0)
