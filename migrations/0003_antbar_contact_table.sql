DROP TABLE IF EXISTS antbar;

CREATE TABLE IF NOT EXISTS antbar_contact (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source_path TEXT,
  landing_page TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_antbar_contact_created ON antbar_contact (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_antbar_contact_email ON antbar_contact (email);
CREATE INDEX IF NOT EXISTS idx_antbar_contact_status ON antbar_contact (status);
