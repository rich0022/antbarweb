CREATE TABLE IF NOT EXISTS contact_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT NOT NULL DEFAULT 'antbar',
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

CREATE INDEX IF NOT EXISTS idx_contact_leads_site_created ON contact_leads (site_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_leads_email ON contact_leads (email);
CREATE INDEX IF NOT EXISTS idx_contact_leads_status ON contact_leads (status);
