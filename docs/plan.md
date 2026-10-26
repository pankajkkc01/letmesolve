# letmesolve.in — Engineering Build Plan

**Companion to `plan.md`** (strategy = *why*; this doc = *how we build, ship, and maintain*).
**Project:** letmesolve.in — a credibility engine + reach-out pipeline for a system builder.
**Owner:** Pankaj Sharma · **Model:** solo builder, buildless static frontend + tiny serverless backend.

---

## How to use this document
- Build **phase by phase, top to bottom.** Do not start a phase until the previous phase's **Exit Criteria** all pass.
- Each phase = one **git branch**, merged when its exit criteria pass, then **tagged** with its version.
- After each phase, append a dated entry to `docs/CHANGELOG.md` describing exactly what shipped.
- The **Exit Criteria** blocks are the "exit matrix" — every box must be checked (pass) to leave the phase.

---

## 1. Tech stack — FINAL

| Layer | Choice | Cost | Notes |
|---|---|---|---|
| Frontend | Vanilla HTML/CSS/JS, **ES modules** | free | No bundler, no build step → almost zero maintenance |
| Styling | Plain CSS, split by concern + design tokens | free | Consistency locked in `tokens.css` |
| Database | **Supabase** (Postgres) | free tier | Projects + enquiries |
| Auth | **Supabase Auth** | free tier | Admin login (single user) |
| Image storage | **Supabase Storage** | free tier | Project screenshots (public bucket) |
| Backend | **Vercel Serverless Functions** (`/api`) | free tier | Enquiry handler only |
| Email | **Mailjet** | free tier | Auto-reply + notification |
| Hosting | **Vercel** | free tier | Git-connected auto-deploy |
| Domain + mailbox | **letmesolve.in** (Hostinger) | paid (domain) | `info@letmesolve.in` |
| Version control | **Git + GitHub** | free | Source of truth, triggers deploys |

**Why buildless:** a solo maintainer benefits most from code that needs no toolchain to run. ES modules give clean file separation natively in the browser. The only thing with dependencies is the `/api` function (Node), which Vercel installs automatically.

---

## 2. Architecture — how the pieces connect

```
                 ┌──────────────────────────────────────────┐
   Visitor ──▶   │  letmesolve.in  (Vercel-hosted static)    │
                 │  index.html  ·  /admin (admin.html)       │
                 └───────┬───────────────────────┬───────────┘
                         │ read projects          │ submit enquiry
                         ▼                         ▼
                 ┌───────────────┐        ┌──────────────────────┐
                 │  Supabase     │        │  Vercel /api/enquiry │
                 │  • projects   │◀───────│  (serverless func)   │
                 │  • enquiries  │  save  │                      │
                 │  • auth       │        │   └─▶ Mailjet ──▶ 📧  │
                 │  • storage    │        │        auto-reply +  │
                 └───────────────┘        │        notification  │
                         ▲                └──────────────────────┘
                         │ login + CRUD
                    You (admin, at /admin)
```

**Three data flows:**
1. **Public read:** browser → Supabase (RLS: anyone can SELECT projects) → renders case studies.
2. **Admin write:** you log in → Supabase (RLS: only authenticated can INSERT/UPDATE/DELETE) → projects change → public site reflects instantly.
3. **Enquiry:** form → `/api/enquiry` (Vercel func) → saves row in Supabase + calls Mailjet (auto-reply to visitor + notify you).

**Secrets boundary:** Supabase *anon key* is safe in frontend (RLS protects data). Mailjet API key + Supabase *service key* live **only** in Vercel env vars, used **only** inside `/api`. Never in frontend files.

---

## 3. Repository structure

```
letmesolve/
├── README.md                  # overview, how to run, structure map
├── .gitignore                 # node_modules, .env, .DS_Store, etc.
├── .env.example               # names of required env vars (NO values)
├── vercel.json                # routes (/admin), security headers
├── package.json               # deps for /api only (supabase-js, node-mailjet)
│
├── public/                    # everything served to the browser
│   ├── index.html             # public portfolio (markup only)
│   ├── admin.html             # admin shell (markup only), served at /admin
│   ├── robots.txt
│   ├── sitemap.xml
│   │
│   ├── css/
│   │   ├── tokens.css         # design variables — colors, type, spacing (LOCKED look)
│   │   ├── base.css           # reset, grid background, typography, layout
│   │   ├── components.css     # buttons, nav, chips, cards, toast
│   │   ├── sections.css       # hero, services, work, about, contact
│   │   └── admin.css          # login screen + admin panel
│   │
│   ├── js/
│   │   ├── config.js          # SUPABASE_URL, SUPABASE_ANON_KEY, constants
│   │   ├── supabaseClient.js  # creates + exports the Supabase client
│   │   ├── data.js            # data layer: loadProjects / save / delete / reorder
│   │   ├── render.js          # renders case studies into the public page
│   │   ├── auth.js            # login, logout, session check
│   │   ├── admin.js           # admin CRUD wiring + image upload
│   │   ├── form.js            # enquiry form → POST /api/enquiry
│   │   └── main.js            # boot + hash/route handling
│   │
│   └── assets/
│       ├── pankaj.jpg         # your photo (About)
│       ├── favicon.ico
│       └── og-preview.jpg     # social-share image
│
├── api/
│   └── enquiry.js             # serverless: validate → Supabase insert → Mailjet send
│
└── docs/
    ├── plan.md                # strategy (the WHY)
    ├── BUILD_PLAN.md          # this file
    ├── SETUP.md               # click-by-click: Supabase, Mailjet, Hostinger DNS, Vercel
    ├── supabase-schema.sql    # tables + RLS = source of truth for the DB
    └── CHANGELOG.md           # dated log of what shipped each phase
```

**File-responsibility rule:** each JS file does *one* job (data, render, auth, admin, form, boot). If a file starts doing two things, split it. This is what keeps a growing project maintainable.

---

## 4. Coding & organization conventions

- **One concern per file** (see above). No mega-files.
- **ES modules:** `<script type="module">`, use `import`/`export`. No global soup.
- **Design tokens only:** every color/size comes from `tokens.css` variables. Never hardcode a hex in a component — this is what keeps every case study visually identical.
- **No secrets in `public/`.** Ever. Only the Supabase anon key (safe by design) lives frontend.
- **Content is data:** zero hardcoded case studies. Everything through the admin.
- **Progressive enhancement:** page renders a graceful state while data loads; never a blank flash.

---

## 5. Git & tracking conventions

So every phase is traceable ("what was done when").

- **Branch per phase:** `phase/0-setup`, `phase/1-static`, `phase/2-data`, … Merge to `main` only when exit criteria pass.
- **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:` prefixes. e.g. `feat(admin): add draft/published toggle`.
- **Tag each phase completion:** `v0.1` (Phase 1), `v0.2` (Phase 2) … `v1.0` at launch (Phase 6).
- **`docs/CHANGELOG.md`:** [Keep-a-Changelog style] — after each phase, add a dated section listing Added / Changed / Fixed. This is your per-phase record.
- **`main` is always deployable.** Vercel auto-deploys `main`; broken code never lands there.

---

## 6. Environment & secrets

`.env.example` (committed, no values) documents what's needed:
```
SUPABASE_URL=
SUPABASE_ANON_KEY=          # frontend-safe
SUPABASE_SERVICE_KEY=       # server-only (api/)
MAILJET_API_KEY=            # server-only
MAILJET_SECRET_KEY=         # server-only
MAIL_FROM=info@letmesolve.in
MAIL_NOTIFY=info@letmesolve.in
```
Real values live in **Vercel → Project → Environment Variables**, never in git.

---

## 7. Phases & exit matrices

> Legend: 🔵 code · 🟢 setup/infra · 🔴 your content

### Phase 0 — Project scaffolding  → tag `v0.0`
**Goal:** an empty, organized, deployable skeleton.
**Scope:** 🔵 create the folder structure · init git + GitHub repo · `.gitignore`, `.env.example`, `README.md` · move `plan.md` + `BUILD_PLAN.md` into `/docs` · 🟢 connect repo to Vercel, deploy a placeholder page.
**Exit criteria (all must pass):**
- [ ] Repo structure matches §3, pushed to GitHub
- [ ] `main` auto-deploys to a Vercel URL (placeholder page loads)
- [ ] `README.md` explains structure + how to run locally
- [ ] `CHANGELOG.md` started

---

### Phase 1 — Static public site (content-empty)  → tag `v0.1`
**Goal:** the portfolio looks final, with no data/admin/backend yet.
**Scope:** 🔵 split the prototype into `index.html` + `css/*` + `js/*` · all sections (hero, services, work[empty state], about, contact) · **identity:** `letmesolve.in` wordmark (`.in` accented), "Pankaj Sharma" sub-line, chosen tagline · responsive (mobile + desktop) · on-page SEO (title, meta, OG, Person JSON-LD) · `robots.txt`, `sitemap.xml`.
**Exit criteria:**
- [ ] Public site visually final on desktop **and** mobile
- [ ] No console errors; no broken layout at 360px / 768px / 1440px
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO = 100
- [ ] Work section shows a clean empty state (no hardcoded cases)
- [ ] Deployed to Vercel from `main`

---

### Phase 2 — Supabase data layer  → tag `v0.2`
**Goal:** case studies render from the database, not from code.
**Scope:** 🟢 create Supabase project · run `supabase-schema.sql` (projects table + RLS) · create `project-images` public bucket · 🔵 `config.js`, `supabaseClient.js`, `data.js`, `render.js` · seed 1–2 sample rows · public page fetches + renders them.
**Exit criteria:**
- [ ] Public site renders case studies fetched from Supabase
- [ ] RLS verified: anonymous can **read**, anonymous **cannot write** (test both)
- [ ] Empty DB → graceful empty state (no crash)
- [ ] `supabase-schema.sql` committed as the DB source of truth

---

### Phase 3 — Admin panel + auth  → tag `v0.3`
**Goal:** you can manage all content, safely, with no code.
> ⚠️ **Superseded 2026-10-27:** the admin panel was removed; content is now edited in `public/js/content.js`. See CHANGELOG → Unreleased.
**Scope:** 🔵 `admin.html` served at `/admin` · `auth.js` (Supabase login gate) · `admin.js` full CRUD: add / edit / delete / reorder · image upload → Storage · **all fields:** name, client, industry, problem, built (+small tech line), impact, tech tags, role, year/duration, screenshot, video, testimonial + **name-links-to-LinkedIn**, draft/published toggle · 🟢 create your admin user, disable public sign-ups.
**Exit criteria:**
- [x] Login works; wrong credentials rejected; logout works
- [x] Unauthenticated visit to `/admin` → blocked at login (no data visible)
- [x] Add / edit / delete / reorder all persist and reflect on public site
- [x] Image upload stores to Supabase + shows on card
- [x] Draft entries hidden from public; published entries visible
- [x] Testimonial name renders as a working LinkedIn link
- [x] Every field renders in the **locked** template (visual consistency intact)

---

### Phase 4 — Reach-out pipeline  → tag `v0.4`
**Goal:** enquiries are captured, acknowledged, and you're notified.
**Scope:** 🔵 enquiry form (name*, company*, problem, how-heard) · `form.js` → `POST /api/enquiry` · `api/enquiry.js`: validate → insert into `enquiries` table → Mailjet auto-reply + notification · 🟢 Vercel env vars · Mailjet domain verification (SPF/DKIM in Hostinger) · 🔴 auto-reply email copy.
**Exit criteria:**
- [ ] Submitting the form saves a row in `enquiries`
- [ ] Visitor receives the branded auto-reply **in inbox, not spam**
- [ ] You receive the notification at `info@letmesolve.in`
- [ ] Mailjet API key **not** present anywhere in `public/` (verified)
- [ ] Form shows success + error states; double-submit prevented
- [ ] Invalid/empty submissions handled gracefully

---

### Phase 5 — About, polish, accessibility  → tag `v0.5`
**Goal:** the site is trustworthy and finished, minus real case studies.
**Scope:** 🔴 your photo + your-voice paragraph · response-time promise · WhatsApp + LinkedIn links live · 🔵 final copy pass (no placeholder text in shipping UI) · loading/empty/error states everywhere · keyboard nav + focus states · `prefers-reduced-motion` respected · favicon + OG image.
**Exit criteria:**
- [ ] About shows real photo + real copy
- [ ] All contact paths (email, LinkedIn, WhatsApp) work
- [ ] No lorem/placeholder anywhere except case studies (which come via admin)
- [ ] Full keyboard navigation; visible focus; a11y ≥ 95
- [ ] Link preview (OG) looks correct when shared on WhatsApp/LinkedIn

---

### Phase 6 — Launch  → tag `v1.0`
**Goal:** live on letmesolve.in with real, credible content.
**Scope:** 🔴 **enter 2–3 real, complete, published case studies via the admin** (the content gate) · 🟢 point letmesolve.in at Vercel · final end-to-end QA · submit to Google Search Console.
**Exit criteria (the launch gate):**
- [ ] **≥ 2–3 real published case studies** live (real problem + built + impact)
- [ ] Full QA pass: every link, form, and admin action tested on live domain
- [ ] `letmesolve.in` resolves with HTTPS; `www` + apex both work
- [ ] Enquiry flow tested end-to-end on production (real auto-reply received)
- [ ] Submitted to Search Console; `sitemap.xml` live
- [ ] `CHANGELOG.md` marks `v1.0`

---

### Phase 7 — Maintenance & v2 (ongoing)
**Goal:** keep it healthy; grow it as reality demands.
**Recurring (see §8).** **v2 backlog (build only when triggered):**
- Lead-tracking admin (enquiries already saved → small add-on) — *trigger: enquiries get hard to manage in email*
- Analytics (privacy-friendly, e.g. Plausible) — *trigger: want to know what visitors read*
- SEO ranking effort (content, backlinks) — *trigger: post-launch, ongoing*
- Featured-project concept — *trigger: ~10+ projects*
- Case-study detail pages — *trigger: cases need more depth*

---

## 8. Maintenance plan

| Cadence | Task |
|---|---|
| **As it happens** | Add new client projects via `/admin` (no code, no deploy) |
| **Monthly** | Skim enquiries; check Vercel + Supabase dashboards are within free limits; confirm auto-reply still delivering (send a test) |
| **Quarterly** | `npm update` in `/api`; re-run Lighthouse; check for dead links; back up Supabase (export projects + enquiries) |
| **Yearly** | Renew domain (Hostinger); refresh case studies + About; review positioning |
| **On any change** | Branch → commit (conventional) → verify exit-style checks → merge → CHANGELOG entry → tag if a phase |

**Backups:** monthly export of Supabase `projects` + `enquiries` to a `/backups` folder (kept out of git if it contains client data — add to `.gitignore`).

---

## 9. Reusable QA checklist (run before any merge to `main`)
- [ ] No console errors
- [ ] Works at 360px, 768px, 1440px
- [ ] No secret keys in `public/`
- [ ] Loading + empty + error states behave
- [ ] Keyboard navigable; focus visible
- [ ] Public read works; writes require auth
- [ ] `CHANGELOG.md` updated

---

## 10. Definition of Done (global)
A phase is done when: exit criteria pass · code is on `main` and auto-deployed · no secrets leaked · `CHANGELOG.md` updated · phase tagged. **"Done" always includes deployed and tracked — not just "works on my machine."**

---

## 11. Phase summary matrix

| Phase | Output | Version | Single most important exit gate |
|---|---|---|---|
| 0 | Scaffold | v0.0 | Repo deploys to Vercel |
| 1 | Static site | v0.1 | Looks final on mobile + desktop |
| 2 | Data layer | v0.2 | Cases render from Supabase; RLS safe |
| 3 | Admin + auth | v0.3 | You manage content; `/admin` gated |
| 4 | Reach-out | v0.4 | Enquiry saves + auto-reply lands in inbox |
| 5 | Polish + About | v0.5 | Real photo/voice; a11y; no placeholders |
| 6 | **Launch** | **v1.0** | **2–3 real case studies live on letmesolve.in** |
| 7 | Maintenance | v1.x | Site stays healthy; grows via admin |
