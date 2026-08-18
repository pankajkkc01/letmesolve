// Boot: mobile nav toggle, case studies fetched from Supabase, and a
// placeholder handler for the contact form. The form starts POSTing to
// /api/enquiry for real in Phase 4 — until then it just tells the visitor
// to email directly instead of failing silently.
import { loadProjects, loadClientLogos } from "./data.js";
import { renderProjects, renderClientLogos } from "./render.js";

function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    links.setAttribute("data-open", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    links.setAttribute("data-open", String(!isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

function showToast(message, variant = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast toast-${variant}`;
  toast.setAttribute("data-visible", "true");

  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.setAttribute("data-visible", "false");
  }, 4000);
}

function initContactFormPlaceholder() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Not live yet — email info@letmesolve.in for now.", "error");
  });
}

/**
 * Local-only design preview: on localhost with ?demo=1 in the URL, renders
 * fictional sample case studies instead of hitting Supabase, so the Work
 * section can be reviewed fully populated. Never active on the deployed
 * site — demoData.js isn't even fetched unless both conditions hold.
 */
function isLocalDemoMode() {
  const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  return isLocalHost && new URLSearchParams(window.location.search).get("demo") === "1";
}

async function initWork() {
  if (isLocalDemoMode()) {
    const { demoProjects } = await import("./demoData.js");
    renderProjects(demoProjects);
    return;
  }

  const projects = await loadProjects();
  renderProjects(projects);
}

/**
 * "Trusted by" strip — independent of case studies (see docs/supabase-schema.sql).
 */
async function initTrustedBy() {
  if (isLocalDemoMode()) {
    const { demoClientLogos } = await import("./demoData.js");
    renderClientLogos(demoClientLogos);
    return;
  }

  const logos = await loadClientLogos();
  renderClientLogos(logos);
}

initNavToggle();
initContactFormPlaceholder();
initWork();
initTrustedBy();
