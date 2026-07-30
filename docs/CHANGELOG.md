# Changelog

All notable changes to this project are documented here, per phase, newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
