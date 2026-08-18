// LOCAL DESIGN PREVIEW ONLY.
// Fictional sample case studies + client logos, used purely to review the
// Work section and "Trusted by" strip fully populated during local
// development. Loaded only when main.js's localhost + ?demo=1 gate passes —
// never fetched, and never rendered, on the deployed site or from the real
// Supabase data.

function monogramLogo(initials, bg, fg = "#fafafa") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" rx="8" fill="${bg}"/><text x="60" y="26" font-family="sans-serif" font-size="16" font-weight="700" fill="${fg}" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const demoProjects = [
  {
    id: "demo-1",
    name: "Dispatch Ops Dashboard",
    client: "Northwind Freight",
    industry: "Logistics",
    problem:
      "Dispatchers were coordinating same-day deliveries across three spreadsheets and a group chat — errors surfaced only after a truck was already on the wrong route.",
    built:
      "A real-time dispatch dashboard with route assignment, driver status, and automatic conflict alerts, wired directly into their existing fleet-tracking API.",
    impact: "Cut same-day dispatch errors by 40% in the first month",
    tech_tags: ["React", "Node.js", "PostgreSQL"],
    role: "Solo builder",
    duration: "6 weeks",
    testimonial:
      "It just works, every day, without anyone thinking about it — which is exactly what we needed.",
    testimonial_name: "Priya Nair, Ops Lead",
    testimonial_linkedin_url: "",
    screenshot_url: "",
    video_url: "",
    sort_order: 1,
  },
  {
    id: "demo-2",
    name: "Client Reporting Pipeline",
    client: "Baseline Analytics",
    industry: "SaaS / Data",
    problem:
      "Monthly client reports meant three days of manually pulling CSVs, reformatting them, and emailing PDFs one by one.",
    built:
      "An automated reporting pipeline that pulls from their existing data sources on a schedule and publishes a branded client portal page per account.",
    impact: "Reduced monthly reporting time from 3 days to under 2 hours",
    tech_tags: ["Python", "Supabase", "Stripe"],
    role: "Solo builder",
    duration: "5 weeks",
    testimonial:
      "We went from dreading the end of the month to barely noticing it happen.",
    testimonial_name: "Marcus Webb, Founder",
    testimonial_linkedin_url: "",
    screenshot_url: "",
    video_url: "",
    sort_order: 2,
  },
  {
    id: "demo-3",
    name: "Warehouse Inventory Sync",
    client: "Ferro & Co",
    industry: "Manufacturing",
    problem:
      "Two warehouses tracked stock on paper sheets that were reconciled by hand once a week, so counts were routinely wrong by the time anyone looked.",
    built:
      "A barcode-scanning inventory app with real-time sync between both sites and low-stock alerts sent straight to the ops lead.",
    impact: "Eliminated stock discrepancies and saved ~15 hours a week",
    tech_tags: ["React Native", "Firebase"],
    role: "Solo builder",
    duration: "7 weeks",
    testimonial:
      "For the first time, what's on the shelf actually matches what the system says.",
    testimonial_name: "Alicia Grant, Ops Lead",
    testimonial_linkedin_url: "",
    screenshot_url: "",
    video_url: "",
    sort_order: 3,
  },
  {
    id: "demo-4",
    name: "Booking Reminder System",
    client: "Clearview Dental",
    industry: "Healthcare",
    problem:
      "No-shows were costing the clinic real chair time because reminder calls were made manually, inconsistently, and often too late to matter.",
    built:
      "An automated SMS + email reminder flow tied to the booking calendar, with a one-tap reschedule link for patients.",
    impact: "Cut no-shows by 32% within the first two months",
    tech_tags: ["Next.js", "Twilio", "Supabase"],
    role: "Solo builder",
    duration: "4 weeks",
    testimonial:
      "Our front desk stopped dreading Mondays. The calendar just fills itself now.",
    testimonial_name: "Dr. Sana Iyer, Owner",
    testimonial_linkedin_url: "",
    screenshot_url: "",
    video_url: "",
    sort_order: 4,
  },
  {
    id: "demo-5",
    name: "Vendor Onboarding Portal",
    client: "Harrow Retail Group",
    industry: "Retail",
    problem:
      "Onboarding a new supplier meant a three-week email chain to collect tax forms, bank details, and product catalogs from every vendor.",
    built:
      "A self-serve vendor portal with guided forms, document upload, and an approval dashboard for the procurement team.",
    impact: "Reduced average vendor onboarding time from 3 weeks to 4 days",
    tech_tags: ["React", "Node.js", "AWS S3"],
    role: "Solo builder",
    duration: "8 weeks",
    testimonial:
      "Vendors actually compliment the process now, which is not a sentence I ever expected to say.",
    testimonial_name: "Owen Brand, Procurement Lead",
    testimonial_linkedin_url: "",
    screenshot_url: "",
    video_url: "",
    sort_order: 5,
  },
  {
    id: "demo-6",
    name: "Support Ticket Triage Bot",
    client: "Pixel & Pine Studio",
    industry: "Creative / SaaS",
    problem:
      "A two-person support team was manually sorting every incoming ticket by urgency and topic before anyone could even start answering.",
    built:
      "A lightweight triage layer that tags, prioritizes, and routes incoming tickets automatically, with a daily digest for anything unresolved.",
    impact: "Cut average first-response time from 6 hours to 45 minutes",
    tech_tags: ["Python", "OpenAI API", "Postgres"],
    role: "Solo builder",
    duration: "5 weeks",
    testimonial:
      "It quietly does the annoying part of the job so we can focus on actually helping people.",
    testimonial_name: "Devon Ashcroft, Co-founder",
    testimonial_linkedin_url: "",
    screenshot_url: "",
    video_url: "",
    sort_order: 6,
  },
];

// Independent of demoProjects — mirrors the real client_logos table, which
// is deliberately decoupled from case studies (see docs/supabase-schema.sql).
export const demoClientLogos = [
  { id: "logo-1", company_name: "Northwind Freight", logo_url: monogramLogo("NF", "#1d4ed8"), website_url: "https://example.com", published: true, sort_order: 1 },
  { id: "logo-2", company_name: "Baseline Analytics", logo_url: monogramLogo("BA", "#09090b"), website_url: "https://example.com", published: true, sort_order: 2 },
  { id: "logo-3", company_name: "Ferro & Co", logo_url: monogramLogo("FC", "#2563eb"), website_url: "https://example.com", published: true, sort_order: 3 },
  { id: "logo-4", company_name: "Clearview Dental", logo_url: monogramLogo("CD", "#0f766e"), website_url: "https://example.com", published: true, sort_order: 4 },
  { id: "logo-5", company_name: "Harrow Retail Group", logo_url: monogramLogo("HR", "#7c3aed"), website_url: "https://example.com", published: true, sort_order: 5 },
  { id: "logo-6", company_name: "Pixel & Pine Studio", logo_url: monogramLogo("PP", "#c2410c"), website_url: "https://example.com", published: true, sort_order: 6 },
];
