// SUPABASE_URL, SUPABASE_ANON_KEY, constants.
//
// The anon key is safe to ship in frontend code — it's a public identifier,
// not a secret. Row Level Security on the database (see docs/supabase-schema.sql)
// is what actually decides who can read/write what. Never put the
// `service_role` key here; that one stays server-side only (api/).
//
// Fill these in from Supabase → Project Settings → API, after running
// docs/supabase-schema.sql (see docs/SETUP.md § Phase 2).

export const SUPABASE_URL = "https://wtvserzudmaccpnfgnxf.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0dnNlcnp1ZG1hY2NwbmZnbnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MzU3MjEsImV4cCI6MjEwMTAxMTcyMX0.-lWZltG9n3N8NsyF6K3VkDLDIc5DwJLc_gWPx4co0bw";
