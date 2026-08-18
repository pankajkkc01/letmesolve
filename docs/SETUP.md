# Setup guide

Click-by-click account setup, filled in as each phase needs it.

## Phase 0 — GitHub + Vercel

1. Create a new empty repository on GitHub (no README/license — this repo already has one).
2. Push this local repo to it (see project owner for the exact commands used).
3. Go to vercel.com → **Add New Project** → import the GitHub repo.
4. Leave build settings default (no framework preset, no build command — it's static).
5. Deploy. Confirm the placeholder page loads at the generated `*.vercel.app` URL.

## Phase 2 — Supabase

1. Go to [supabase.com](https://supabase.com) → sign in (GitHub login is fastest) → **New project**.
2. Pick your organization, name it (e.g. `letmesolve`), set a database password (save it somewhere — you likely won't need it day-to-day, but you'll want it if you ever connect a Postgres client directly), pick the region closest to you, and create the project. Provisioning takes ~1-2 minutes.
3. Once the project is ready, go to **Project Settings → API**. Copy:
   - **Project URL** (e.g. `https://xxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys" — NOT the `service_role` key, that one never leaves the server)
4. Go to **SQL Editor → New query**, paste the entire contents of `docs/supabase-schema.sql`, and run it. This creates the `projects` table, its RLS policies, the storage policies, and seeds 2 sample case studies.
5. Go to **Storage → New bucket**. Name it exactly `project-images`, toggle **Public bucket** ON, and create it. (The read/write policies for it were already created by the SQL script in step 4.)
6. Paste the Project URL + anon key into `public/js/config.js`.

## Phase 3 — Admin user + auth

1. Go to your Supabase project → **Authentication → Providers** → confirm **Email** is the only enabled provider (it is by default).
2. Go to **Authentication → Sign In / Providers** (or **Authentication → Settings**, naming varies by Supabase version) and turn **Allow new users to sign up OFF**. There's no sign-up form anywhere in this project's UI, but disabling it at the project level closes the `supabase.auth.signUp` API path too, so nobody could self-register even by hand-crafting a request.
3. Go to **Authentication → Users → Add user → Create new user**. Enter your own email + a strong password, and toggle **Auto Confirm User** ON (skips the email-confirmation step since you're creating it directly, not through a public sign-up flow).
4. Test the login at `/admin` on the deployed site (or locally) with that email + password.
5. If you ever need to reset the password, do it from this same **Authentication → Users** table — click the user → **Send password recovery** or **Update password** directly.

## Phase 4 — Mailjet + domain email

_Added when Phase 4 starts: Mailjet account, SPF/DKIM records in Hostinger DNS._

## Phase 6 — Domain

_Added when Phase 6 starts: pointing letmesolve.in DNS at Vercel._
