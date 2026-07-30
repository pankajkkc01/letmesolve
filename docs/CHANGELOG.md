# Changelog

All notable changes to this project are documented here, per phase, newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
- Static verification only (no orphaned CSS classes, no missing JS targets, no dead anchors, JS syntax valid). Live-browser checks — responsive at 360/768/1440px, console-clean, Lighthouse (Performance ≥90, Accessibility ≥95, SEO=100) — were **not run this session** (Chrome extension mid-install); still needed to formally close Phase 1's exit criteria

## [v0.0] — 2026-07-29 — Phase 0: Project scaffolding

### Added
- Repository structure (`public/`, `api/`, `docs/`) matching the build plan
- `.gitignore`, `.env.example`, `package.json`, `vercel.json`
- Placeholder `public/index.html`, `robots.txt`, `sitemap.xml`
- Empty stub files for `public/css/*`, `public/js/*` (filled in later phases)
- Stub `api/enquiry.js` serverless function (returns 501 until Phase 4)
- `README.md`, `docs/plan.md`, `docs/SETUP.md`, `docs/supabase-schema.sql` (placeholder)
