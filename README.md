# letmesolve.in

Portfolio + reach-out pipeline for a system builder. Buildless static frontend (no framework, no bundler) plus one tiny Node serverless function for the enquiry form.

See [`docs/plan.md`](docs/plan.md) for the full phase-by-phase build plan and architecture.

## Structure

```
letmesolve/
├── public/        # everything served to the browser (HTML/CSS/JS, static assets)
├── api/            # one Vercel serverless function (enquiry form handler)
└── docs/           # plan, setup guide, DB schema, changelog
```

- `public/index.html` — the site itself (plain HTML, no build step)
- `public/css/` — styles split by concern (tokens → base → components → sections)
- `public/js/` — ES modules, one job per file (content, render, form, main) — site content lives in `content.js`
- `api/enquiry.js` — validates + saves an enquiry, sends emails via Mailjet
- `docs/CHANGELOG.md` — dated record of what shipped each phase

## Running locally

This is a buildless static site — no `npm install`, no dev server required to view the frontend:

1. Open `public/index.html` directly in a browser, **or**
2. Serve the `public/` folder with any static server, e.g. `npx serve public`

The `/api` function needs the Vercel dev runtime to run locally (once it has real logic in Phase 4):

```
npm i -g vercel
vercel dev
```

Copy `.env.example` to `.env` and fill in real values (Supabase, Mailjet) — never commit `.env`.

## Deployment

Pushing to `main` on GitHub auto-deploys to Vercel. See `docs/CHANGELOG.md` for what's live at each version.
