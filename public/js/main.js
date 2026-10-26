// Boot: mobile nav toggle, case studies fetched from Supabase, and the
// contact form (form.js -> POST /api/enquiry).
import { initContactForm } from "./form.js";
import { loadProjects, loadClientLogos } from "./data.js";
import { renderProjects, renderClientLogos, renderWorkState } from "./render.js";

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

  try {
    renderProjects(await loadProjects());
  } catch (err) {
    console.error("Failed to load projects:", err.message);
    renderWorkState("error");
  }
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
initContactForm(showToast);
initWork();
initTrustedBy();
