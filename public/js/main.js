// Boot: mobile nav toggle, case studies fetched from Supabase, and a
// placeholder handler for the contact form. The form starts POSTing to
// /api/enquiry for real in Phase 4 — until then it just tells the visitor
// to email directly instead of failing silently.
import { loadProjects } from "./data.js";
import { renderProjects } from "./render.js";

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

async function initWork() {
  const projects = await loadProjects();
  renderProjects(projects);
}

initNavToggle();
initContactFormPlaceholder();
initWork();
