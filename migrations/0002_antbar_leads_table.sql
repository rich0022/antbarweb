DROP TABLE IF EXISTS contact_leads;

CREATE TABLE IF NOT EXISTS antbar (
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

CREATE INDEX IF NOT EXISTS idx_antbar_created ON antbar (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_antbar_email ON antbar (email);
CREATE INDEX IF NOT EXISTS idx_antbar_status ON antbar (status);
