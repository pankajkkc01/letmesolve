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

function renderCard(project) {
  const meta = [project.client, project.industry].filter(Boolean).join(" · ");
  const roleYear = [project.role, project.duration].filter(Boolean).join(" · ");

  return `
    <article class="card case-card">
      ${
        project.screenshot_url
          ? `<div class="case-media"><img src="${escapeHtml(project.screenshot_url)}" alt="${escapeHtml(project.name)} screenshot" loading="lazy" /></div>`
          : ""
      }
      <div class="case-body">
        <div class="case-head">
          <h3 class="card-title">${escapeHtml(project.name)}</h3>
          ${meta ? `<span class="case-meta">${meta}</span>` : ""}
        </div>
        ${project.problem ? `<p class="case-block"><strong>Problem:</strong> ${escapeHtml(project.problem)}</p>` : ""}
        ${project.built ? `<p class="case-block"><strong>Built:</strong> ${escapeHtml(project.built)}</p>` : ""}
        ${project.impact ? `<p class="case-block"><strong>Impact:</strong> ${escapeHtml(project.impact)}</p>` : ""}
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
 * Replaces the Work section's list with rendered case studies.
 * No-op on an empty array — the pre-rendered empty-state stays visible.
 */
export function renderProjects(projects) {
  const list = document.getElementById("work-list");
  if (!list || !projects || projects.length === 0) return;

  list.innerHTML = projects.map(renderCard).join("");
}
