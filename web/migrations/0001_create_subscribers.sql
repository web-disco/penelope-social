-- Newsletter subscribers.
--
-- The footer signup used to post straight to a Mailchimp list from the browser.
-- Signups are now captured here instead and exported via /api/subscribers.csv,
-- so the write happens inside the same Worker that answers the visitor: there
-- is no third-party call that can fail and silently drop a signup while the
-- page says it worked.
--
-- consent + created_at + ip exist for CASL: sending marketing email in Canada
-- requires being able to PROVE consent, not just assert it.

CREATE TABLE IF NOT EXISTS subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Stored lowercased and trimmed so the UNIQUE constraint actually dedupes;
  -- a second signup is a no-op rather than an error the visitor sees.
  email       TEXT    NOT NULL UNIQUE,
  consent     INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL,
  ip          TEXT,
  -- Which form it came from. Only the footer can reach the endpoint today.
  source      TEXT    NOT NULL DEFAULT 'footer'
);

-- The export orders by signup date; the index keeps that cheap as the list grows.
CREATE INDEX IF NOT EXISTS subscribers_created_at ON subscribers (created_at);
