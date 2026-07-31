# Changelog

All notable changes to this project are documented here, per phase, newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — Phase 3: Admin panel + auth

### Added
- `admin.html` (served at `/admin` via a `vercel.json` rewrite) — login screen + admin panel shell, `noindex` and kept out of `robots.txt` crawling
- `auth.js` — `signIn` / `signOut` / `getSession` / `onAuthChange` wrapping Supabase Auth; no sign-up path exists anywhere in the UI (single-admin-user model)
- `data.js` gains `loadAllProjects` (draft + published, for the admin list), `saveProject` (insert/update via upsert), `deleteProject`, `updateSortOrder`, `uploadProjectImage` (uploads to the `project-images` bucket, returns its public URL)
- `admin.js` — full CRUD wiring: add / edit / delete, up/down reordering (renumbers `sort_order` for the whole list on every move so ordering never drifts), screenshot upload with a live preview, draft/published toggle (new entries default to draft), all fields from the schema including the testimonial name-links-to-LinkedIn behavior reused from the public renderer
- `admin.css` — login screen + admin list/form styling, tokens only
- `docs/SETUP.md` — Phase 3 section: creating the single admin user in the Supabase dashboard, disabling public sign-ups

### Notes
- Code-complete and self-reviewed; the actual login round-trip against a live Supabase project still needs the admin user created per `docs/SETUP.md` § Phase 3, then a manual pass through the full exit-criteria checklist in `docs/plan.md` § Phase 3 before this is tagged `v0.3` and merged to `main`
- Reordering always renumbers every row's `sort_order` to its new array index rather than swapping two raw values — avoids ordering drift if rows ever end up with duplicate/gapped `sort_order` values
- Image filenames are sanitized before use as the storage object key (non-alphanumeric characters replaced with `-`) to avoid upload failures on filenames with spaces/special characters

## [v0.2] — 2026-07-31 — Phase 2: Supabase data layer

### Added
- `docs/supabase-schema.sql` — `projects` table (full field set: name, client, industry, role, duration, problem, built, impact, tech_tags, screenshot_url, video_url, testimonial + testimonial_name/testimonial_linkedin_url, published, sort_order), `updated_at` trigger, RLS policies (anon reads published rows only, authenticated has full CRUD), storage policies for the `project-images` bucket, and idempotent seed data (2 sample case studies)
- `supabaseClient.js` — Supabase client via CDN ESM import (buildless — no npm install for the frontend)
- `data.js` — `loadProjects()`: fetches published projects ordered by `sort_order`, fails soft to an empty array
- `render.js` — renders case-study cards into `#work-list` (problem/built/impact, tech tag chips, role/duration, testimonial with LinkedIn-linked name, optional screenshot/video); leaves the static empty-state untouched when there are 0 published rows
- `.case-card` / `.case-media` / `.case-body` / `.case-tags` / `.case-testimonial` styles in `sections.css`, built entirely from existing design tokens
- `main.js` now loads + renders projects on boot alongside the existing nav toggle and contact form placeholder
- `docs/SETUP.md` — click-by-click Supabase project setup for Phase 2

### Notes
- Verified live against a real Supabase project: anon read returns both seeded published case studies; anon INSERT is rejected (401, RLS violation); anon DELETE matches zero rows (row still present) — read works, write doesn't
- Manual QA: both seeded case studies render correctly on a local static server, no console errors
- `public/js/config.js` now contains the real (frontend-safe) Project URL + anon key for this Supabase project — this is expected and matches the plan's secrets boundary (anon key is public-safe; `service_role` key never goes here)
- `save` / `delete` / `reorder` in `data.js` and the `/admin` UI are Phase 3 — this phase only wires the public read path

## [v0.1] — 2026-07-31 — Phase 1: Static public site

### Added
- `tokens.css` — full design system (color, type scale, spacing, radius, shadow, motion tokens)
- `base.css` — reset, typography, subtle grid background, layout primitives, focus states
- `components.css` — nav (with mobile toggle), buttons, chips, cards, empty-state, toast
- `sections.css` — responsive layouts for hero, services, work, about, contact, footer
- `index.html` — full markup: hero, services (4 cards), work (empty state), about, contact form, footer
- Identity: `letmesolve.in` wordmark (`.in` accented), "Pankaj Sharma · System Builder" hero eyebrow, tagline
- On-page SEO: title, meta description, canonical, Open Graph + Twitter Card tags, Person JSON-LD, inline SVG favicon
- `main.js` — mobile nav toggle, contact form placeholder handler (form wiring itself is Phase 4)

### Notes
- Contact form is structural only — submitting shows a toast pointing to direct email; `POST /api/enquiry` wiring lands in Phase 4
- About section uses an initials placeholder instead of a real photo; About copy is provisional (real photo + final voice pass is Phase 5)
- LinkedIn/WhatsApp links intentionally omitted (Phase 5) rather than shipped as dead links
- Verified: static checks (no orphaned CSS classes, no missing JS targets, no dead anchors, JS syntax valid) + manual visual check by Pankaj on desktop and phone width, looked correct on both
- Not run: a formal Lighthouse audit (Performance/Accessibility/SEO scores) — worth a pass before Phase 6 launch QA if not done sooner

## [v0.0] — 2026-07-29 — Phase 0: Project scaffolding

### Added
- Repository structure (`public/`, `api/`, `docs/`) matching the build plan
- `.gitignore`, `.env.example`, `package.json`, `vercel.json`
- Placeholder `public/index.html`, `robots.txt`, `sitemap.xml`
- Empty stub files for `public/css/*`, `public/js/*` (filled in later phases)
- Stub `api/enquiry.js` serverless function (returns 501 until Phase 4)
- `README.md`, `docs/plan.md`, `docs/SETUP.md`, `docs/supabase-schema.sql` (placeholder)
