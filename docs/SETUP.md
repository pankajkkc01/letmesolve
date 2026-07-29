# Setup guide

Click-by-click account setup, filled in as each phase needs it.

## Phase 0 — GitHub + Vercel

1. Create a new empty repository on GitHub (no README/license — this repo already has one).
2. Push this local repo to it (see project owner for the exact commands used).
3. Go to vercel.com → **Add New Project** → import the GitHub repo.
4. Leave build settings default (no framework preset, no build command — it's static).
5. Deploy. Confirm the placeholder page loads at the generated `*.vercel.app` URL.

## Phase 2 — Supabase

_Added when Phase 2 starts: project creation, running `supabase-schema.sql`, storage bucket setup._

## Phase 4 — Mailjet + domain email

_Added when Phase 4 starts: Mailjet account, SPF/DKIM records in Hostinger DNS._

## Phase 6 — Domain

_Added when Phase 6 starts: pointing letmesolve.in DNS at Vercel._
