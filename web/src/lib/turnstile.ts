/**
 * The Turnstile sitekey, resolved once so a missing one cannot pass quietly.
 *
 * An *absent* variable fails the build. The widget is `appearance="interaction-only"`
 * and so invisible even when it is working, which means a build that silently
 * drops it renders pages indistinguishable from correct ones. Meanwhile
 * `TURNSTILE_SECRET_KEY` is a Worker secret and survives every deploy, so the
 * Worker keeps demanding a token the page no longer sends and answers every
 * submission with "Captcha verification failed".
 *
 * That combination — green build, perfect-looking pages, all three forms
 * refusing every submission — took the live site down once already. Contact and
 * events enquiries are deliberately not stored (see worker/index.ts), so the
 * only record of what was lost is a Worker log line that ages out in days.
 * Failing the build is cheap; finding out from a client asking why the enquiries
 * stopped is not.
 *
 * An *explicitly empty* value still builds, without the widget — the Worker's
 * verify step passes through on the same reasoning when no secret is set. That
 * is the deliberate opt-out, and it is the same distinction `data.ts` draws for
 * the Sanity project id: an absent variable is a mistake, an empty one is a
 * decision. Only by keeping them distinguishable is "forgot to configure the
 * build" representable at all.
 */
const configured = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined

if (configured === undefined) {
  throw new Error(
    'PUBLIC_TURNSTILE_SITE_KEY is not set.\n\n' +
      'Without a sitekey no widget renders, no token is sent, and the Worker ' +
      'rejects every contact, events and newsletter submission.\n\n' +
      '  local CI:  add it to .env\n' +
      '  Workers Builds:  Settings > Builds > Variables\n\n' +
      'To build deliberately without Turnstile, set it to an empty string.',
  )
}

export const siteKey = configured
