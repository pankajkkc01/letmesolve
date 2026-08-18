-- Source of truth for the Supabase schema.
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query → Run).
-- Safe to re-run: every statement is idempotent (create-if-not-exists / drop-then-create).

-- ============================================================
-- projects table
-- ============================================================
-- Full field set from the build plan (Phase 2 stores the columns;
-- Phase 3's admin panel is what lets a human fill them in without code).

create table if not exists public.projects (
  id                          uuid primary key default gen_random_uuid(),

  -- core
  name                        text not null,
  client                      text,
  industry                    text,
  role                        text,
  duration                    text,             -- e.g. "3 weeks", "2026"

  -- the story
  problem                     text,
  built                       text,             -- what was built (+ a short tech line)
  impact                      text,
  tech_tags                   text[] not null default '{}',

  -- media (screenshot_url / video_url / client_logo_url point at Supabase Storage or an external link)
  screenshot_url              text,
  video_url                   text,
  client_logo_url             text,

  -- testimonial (name renders as a working LinkedIn link when the URL is set)
  testimonial                 text,
  testimonial_name            text,
  testimonial_linkedin_url    text,

  -- publishing + ordering
  published                   boolean not null default false,
  sort_order                  integer not null default 0,

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- Phase 3 addition: run this on its own if the table already existed
-- before client_logo_url was added to the CREATE TABLE above.
alter table public.projects
  add column if not exists client_logo_url text;

create index if not exists projects_published_sort_idx
  on public.projects (published, sort_order);

-- Keep updated_at accurate on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security — projects
-- ============================================================
-- Anonymous visitors: read published rows only, never write.
-- Authenticated (you, via /admin in Phase 3): full read + write.

alter table public.projects enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  to anon
  using (published = true);

drop policy if exists "Authenticated can read all projects" on public.projects;
create policy "Authenticated can read all projects"
  on public.projects for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert projects" on public.projects;
create policy "Authenticated can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update projects" on public.projects;
create policy "Authenticated can update projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete projects" on public.projects;
create policy "Authenticated can delete projects"
  on public.projects for delete
  to authenticated
  using (true);

-- ============================================================
-- Storage — project-images bucket
-- ============================================================
-- Create the bucket itself in the dashboard first (Storage → New bucket →
-- name "project-images" → Public bucket = ON). These policies then govern
-- who can read/write the objects inside it.

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
  on storage.objects for select
  to public
  using (bucket_id = 'project-images');

drop policy if exists "Authenticated can upload project images" on storage.objects;
create policy "Authenticated can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can update project images" on storage.objects;
create policy "Authenticated can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "Authenticated can delete project images" on storage.objects;
create policy "Authenticated can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

-- ============================================================
-- client_logos table ("Trusted by" strip — independent of case studies)
-- ============================================================
-- Deliberately decoupled from projects: a logo here doesn't require a full
-- case study, and a case study doesn't need a logo. Managed from its own
-- small section in /admin.

create table if not exists public.client_logos (
  id              uuid primary key default gen_random_uuid(),
  company_name    text not null,
  logo_url        text not null,
  website_url     text,
  published       boolean not null default false,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Phase 3 addition: run this on its own if the table already existed
-- before website_url was added to the CREATE TABLE above.
alter table public.client_logos
  add column if not exists website_url text;

create index if not exists client_logos_published_sort_idx
  on public.client_logos (published, sort_order);

drop trigger if exists client_logos_set_updated_at on public.client_logos;
create trigger client_logos_set_updated_at
  before update on public.client_logos
  for each row execute function public.set_updated_at();

alter table public.client_logos enable row level security;

drop policy if exists "Public can read published client logos" on public.client_logos;
create policy "Public can read published client logos"
  on public.client_logos for select
  to anon
  using (published = true);

drop policy if exists "Authenticated can read all client logos" on public.client_logos;
create policy "Authenticated can read all client logos"
  on public.client_logos for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert client logos" on public.client_logos;
create policy "Authenticated can insert client logos"
  on public.client_logos for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update client logos" on public.client_logos;
create policy "Authenticated can update client logos"
  on public.client_logos for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete client logos" on public.client_logos;
create policy "Authenticated can delete client logos"
  on public.client_logos for delete
  to authenticated
  using (true);

-- Logo files reuse the existing project-images bucket + its policies —
-- no new bucket needed.

-- ============================================================
-- Seed data — 1-2 sample published case studies (Phase 2 exit criteria)
-- ============================================================
-- Fixed UUIDs make this block idempotent: re-running it upserts the same
-- two rows instead of duplicating them. Replace with real work in Phase 6.

insert into public.projects (
  id, name, client, industry, role, duration, problem, built, impact,
  tech_tags, published, sort_order
) values (
  '00000000-0000-0000-0000-000000000001',
  'Order Sync Dashboard',
  'A mid-size logistics operator',
  'Logistics',
  'Solo builder',
  '3 weeks',
  'Warehouse staff were re-keying order status between two systems that didn''t talk to each other, causing daily mismatches.',
  'A lightweight internal dashboard that polls both systems and reconciles order status automatically, with a manual-override view for edge cases.',
  'Cut daily reconciliation work from ~90 minutes to under 10, and eliminated the mismatches that used to reach customers.',
  array['Node.js', 'Postgres', 'REST APIs'],
  true,
  1
)
on conflict (id) do update set
  name = excluded.name,
  client = excluded.client,
  industry = excluded.industry,
  role = excluded.role,
  duration = excluded.duration,
  problem = excluded.problem,
  built = excluded.built,
  impact = excluded.impact,
  tech_tags = excluded.tech_tags,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.projects (
  id, name, client, industry, role, duration, problem, built, impact,
  tech_tags, published, sort_order
) values (
  '00000000-0000-0000-0000-000000000002',
  'Client Intake Automation',
  'A boutique consulting firm',
  'Professional services',
  'Solo builder',
  '2 weeks',
  'New client intake was a scattered mix of email threads, a shared spreadsheet, and manual calendar invites.',
  'A single intake form that creates the client record, schedules the kickoff call, and notifies the right team member — no spreadsheet involved.',
  'Intake time dropped from ~2 days of back-and-forth to same-day scheduling, with zero dropped handoffs since launch.',
  array['Vercel Functions', 'Supabase', 'Calendar API'],
  true,
  2
)
on conflict (id) do update set
  name = excluded.name,
  client = excluded.client,
  industry = excluded.industry,
  role = excluded.role,
  duration = excluded.duration,
  problem = excluded.problem,
  built = excluded.built,
  impact = excluded.impact,
  tech_tags = excluded.tech_tags,
  published = excluded.published,
  sort_order = excluded.sort_order;
