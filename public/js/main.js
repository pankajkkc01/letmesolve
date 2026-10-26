// Boot: mobile nav toggle, case studies + client logos (content.js), and the
// contact form (form.js -> POST /api/enquiry).
import { initContactForm } from "./form.js";
import { projects, clientLogos } from "./content.js";
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

initNavToggle();
initContactForm(showToast);
renderProjects(projects);
renderClientLogos(clientLogos);
