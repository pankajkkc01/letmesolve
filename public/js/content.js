// Site content, edited by hand. This replaces the old /admin panel + database:
// to add a client logo or a case study, add an entry below, drop the image in
// public/assets/, commit, and push — Vercel redeploys automatically.
//
// ORDER = display order (first item shows first).

// ---------------------------------------------------------------------------
// "Trusted by" logo strip
// ---------------------------------------------------------------------------
// company_name  required — used as the image alt text and link label
// logo_url      required — file in public/assets/logos/ (png / webp / avif / svg)
// website_url   optional — when set, the logo links to it in a new tab
export const clientLogos = [
  {
    company_name: "BCI",
    logo_url: "assets/logos/bci.png",
    website_url: null, // TODO: add Business Coaching India's website
  },
  {
    company_name: "SIG Systems Pvt. Ltd.",
    logo_url: "assets/logos/sig-systems.png",
    website_url: "https://www.sigsystems.com",
  },
  {
    company_name: "ecoste",
    logo_url: "assets/logos/ecoste.png",
    website_url: "https://ecoste.in", // TODO: confirm this is the right address
  },
  {
    company_name: "metamask",
    logo_url: "assets/logos/metamask.webp",
    website_url: "https://metamask.io",
  },
  {
    company_name: "BookLeaf Publishing",
    logo_url: "assets/logos/bookleaf-publishing.avif",
    website_url: "https://www.bookleafpub.in",
  },
  {
    company_name: "Central Hotels",
    logo_url: "assets/logos/central-hotels.avif",
    website_url: null, // TODO: add Central Hotels' website
  },
];

// ---------------------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------------------
// Required: name
// Optional: client, industry, role, duration, problem, built, impact,
//           tech_tags (array), screenshot_url (file in public/assets/projects/),
//           video_url, testimonial, testimonial_name, testimonial_linkedin_url
// Leave a field out (or null) and that part of the card simply doesn't render.
export const projects = [
  {
    name: "Order Sync Dashboard",
    client: "A mid-size logistics operator",
    industry: "Logistics",
    role: "Solo builder",
    duration: "3 weeks",
    problem:
      "Warehouse staff were re-keying order status between two systems that didn't talk to each other, causing daily mismatches.",
    built:
      "A lightweight internal dashboard that polls both systems and reconciles order status automatically, with a manual-override view for edge cases.",
    impact:
      "Cut daily reconciliation work from ~90 minutes to under 10, and eliminated the mismatches that used to reach customers.",
    tech_tags: ["Node.js", "Postgres", "REST APIs"],
    screenshot_url: "assets/projects/order-sync-dashboard.png",
    testimonial:
      "I am Kanak Jain (Direct BCI), and I had a great experience working with LetMeSolve.in. Their team was highly professional, knowledgeable, and supportive throughout the entire process.",
    testimonial_name: "Kanak Jain",
    testimonial_linkedin_url: "https://www.linkedin.com/in/pankaj-sharma-ai-engineer/",
  },
  {
    name: "Client Intake Automation",
    client: "A boutique consulting firm",
    industry: "Professional services",
    role: "Solo builder",
    duration: "2 weeks",
    problem:
      "New client intake was a scattered mix of email threads, a shared spreadsheet, and manual calendar invites.",
    built:
      "A single intake form that creates the client record, schedules the kickoff call, and notifies the right team member — no spreadsheet involved.",
    impact:
      "Intake time dropped from ~2 days of back-and-forth to same-day scheduling, with zero dropped handoffs since launch.",
    tech_tags: ["Vercel Functions", "Supabase", "Calendar API"],
  },
];
