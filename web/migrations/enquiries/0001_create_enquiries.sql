-- Contact and events form submissions.
--
-- These used to exist only as an email. That makes the notification the system
-- of record, which is a bad place for one: a send can fail, land in spam, or be
-- deleted from an inbox, and the enquiry is then gone with nothing to show it
-- ever arrived. A catering enquiry is revenue, so it gets a row.
--
-- The email is still sent — this is the durable copy behind it, and `notified`
-- records whether the send actually worked, so "which enquiries did we never
-- get told about?" is a query rather than a guess.

CREATE TABLE IF NOT EXISTS enquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  -- 'contact' or 'events'.
  form        TEXT    NOT NULL,
  created_at  TEXT    NOT NULL,
  -- Pulled out of the payload so the list is scannable and searchable without
  -- parsing JSON on every row. Both are best-effort: the forms can change.
  name        TEXT,
  email       TEXT,
  -- Every submitted field, verbatim, so nothing is lost to a schema decision
  -- made before we knew which fields would matter.
  payload     TEXT    NOT NULL,
  ip          TEXT,
  -- 0 until the notification email is confirmed sent. Sending is unavailable
  -- until a domain is onboarded to Email Service, so early rows will be 0.
  notified    INTEGER NOT NULL DEFAULT 0
);

-- The export and the dashboard both read newest-first.
CREATE INDEX IF NOT EXISTS enquiries_created_at ON enquiries (created_at);
-- "Show me everything nobody was emailed about."
CREATE INDEX IF NOT EXISTS enquiries_notified ON enquiries (notified);
