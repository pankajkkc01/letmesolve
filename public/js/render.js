// Renders case studies into the public page's Work section.
// If there are no published projects, the static empty-state markup already
// in index.html is left alone — this file only ever adds cards, it never
// has to render "empty" itself.

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function renderTechTags(tags) {
  if (!tags || tags.length === 0) return "";
  const chips = tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("");
  return `<div class="case-tags">${chips}</div>`;
}

function renderTestimonial(project) {
  if (!project.testimonial) return "";

  const name = escapeHtml(project.testimonial_name);
  const attribution = project.testimonial_name
    ? project.testimonial_linkedin_url
      ? `<a href="${escapeHtml(project.testimonial_linkedin_url)}" target="_blank" rel="noopener">${name}</a>`
      : name
    : "";

  return `
    <blockquote class="case-testimonial">
      <p>&ldquo;${escapeHtml(project.testimonial)}&rdquo;</p>
      ${attribution ? `<footer>${attribution}</footer>` : ""}
    </blockquote>
  `;
}

function renderWindow(project) {
  const label = escapeHtml(project.client || project.industry || project.name);
  const media = project.screenshot_url
    ? `<img src="${escapeHtml(project.screenshot_url)}" alt="${escapeHtml(project.name)} screenshot" loading="lazy" />`
    : `<div class="case-media-placeholder" aria-hidden="true">${escapeHtml((project.name || "?").charAt(0).toUpperCase())}</div>`;

  const impactBadge = project.impact
    ? `<span class="case-impact-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>
        ${escapeHtml(project.impact)}
      </span>`
    : "";

  return `
    <div class="case-window">
      <div class="case-window-bar">
        <span class="case-window-dots" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="case-window-url">${label}</span>
      </div>
      <div class="case-media">
        ${media}
        ${impactBadge}
      </div>
    </div>
  `;
}

function renderCard(project) {
  const meta = [project.client, project.industry].filter(Boolean).join(" · ");
  const roleYear = [project.role, project.duration].filter(Boolean).join(" · ");

  return `
    <article class="card case-card">
      ${renderWindow(project)}
      <div class="case-body">
        <div class="case-head">
          <h3 class="card-title">${escapeHtml(project.name)}</h3>
          ${meta ? `<span class="case-meta">${meta}</span>` : ""}
        </div>
        ${project.problem ? `<p class="case-block"><strong>Problem:</strong> ${escapeHtml(project.problem)}</p>` : ""}
        ${project.built ? `<p class="case-block"><strong>Built:</strong> ${escapeHtml(project.built)}</p>` : ""}
        ${renderTechTags(project.tech_tags)}
        ${roleYear ? `<p class="case-role">${escapeHtml(roleYear)}</p>` : ""}
        ${
          project.video_url
            ? `<a class="contact-link" href="${escapeHtml(project.video_url)}" target="_blank" rel="noopener">Watch walkthrough →</a>`
            : ""
        }
        ${renderTestimonial(project)}
      </div>
    </article>
  `;
}

/**
 * Fades each case-study tile in as it scrolls into view. Skipped entirely
 * for prefers-reduced-motion — tiles just appear at full opacity instead.
 */
function initCardReveal(list) {
  const cards = list.querySelectorAll(".case-card");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card) => observer.observe(card));
}

/**
 * Renders the "Trusted by" logo strip from published client_logos rows.
 * Independent of case studies — see docs/supabase-schema.sql. No-op
 * (leaves the element empty) if there are none.
 */
export function renderClientLogos(logos) {
  const container = document.getElementById("logo-marquee");
  if (!container || !logos || logos.length === 0) return;

  const logoImg = (logo) => {
    const img = `<img src="${escapeHtml(logo.logo_url)}" alt="${escapeHtml(logo.company_name)}" loading="lazy" />`;
    return logo.website_url
      ? `<a class="logo-tile" href="${escapeHtml(logo.website_url)}" target="_blank" rel="noopener noreferrer">${img}</a>`
      : `<span class="logo-tile">${img}</span>`;
  };

  // Duplicated so the CSS animation (translateX(-50%)) loops seamlessly.
  const track = [...logos, ...logos].map(logoImg).join("");
  container.innerHTML = `<div class="logo-marquee-track">${track}</div>`;
}

/**
 * Replaces the Work section's list with rendered case studies.
 * No-op on an empty array — the pre-rendered empty-state stays visible.
 */
const WORK_STATES = {
  empty: {
    title: "Case studies are coming soon",
    text: `I'm publishing finished client work here as projects wrap up.
      Want to be one of the first? <a class="contact-link" href="#contact">Get in touch</a>.`,
  },
  error: {
    title: "Couldn't load case studies",
    text: `Something went wrong on my end. Please refresh the page, or
      <a class="contact-link" href="#contact">get in touch</a> and I'll walk you through my work directly.`,
  },
};

/** Replaces the Work list with an empty or error message. */
export function renderWorkState(state) {
  const list = document.getElementById("work-list");
  if (!list) return;
  const { title, text } = WORK_STATES[state];
  list.removeAttribute("aria-busy");
  list.innerHTML = `
    <div class="empty-state" role="${state === "error" ? "alert" : "status"}">
      <p class="empty-state-title">${title}</p>
      <p class="empty-state-text">${text}</p>
    </div>`;
}

export function renderProjects(projects) {
  const list = document.getElementById("work-list");
  if (!list) return;
  if (!projects || projects.length === 0) {
    renderWorkState("empty");
    return;
  }
  list.removeAttribute("aria-busy");

  const cardsHtml = projects.map(renderCard).join("");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    // No auto-scroll for reduced-motion users — wrap into a static grid instead
    // of a track, so every card stays reachable without relying on animation.
    list.classList.add("work-list-static");
    list.innerHTML = cardsHtml;
    initCardReveal(list);
  } else {
    // Duplicated so the CSS animation (translateX(-50%)) loops seamlessly.
    list.innerHTML = `<div class="work-track">${cardsHtml}${cardsHtml}</div>`;
    initCardReveal(list.querySelector(".work-track"));
  }
}
