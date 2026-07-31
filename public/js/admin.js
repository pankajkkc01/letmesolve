// Admin CRUD wiring + image upload — filled in Phase 3.
// Gates the whole page on an authenticated session, then wires the
// add/edit/delete/reorder flows against data.js.
import { signIn, signOut, onAuthChange } from "./auth.js";
import {
  loadAllProjects,
  saveProject,
  deleteProject,
  updateSortOrder,
  uploadProjectImage,
} from "./data.js";

const loginScreen = document.getElementById("login-screen");
const adminPanel = document.getElementById("admin-panel");
const logoutBtn = document.getElementById("logout-btn");

const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

const addBtn = document.getElementById("add-btn");
const listStatus = document.getElementById("list-status");
const adminList = document.getElementById("admin-list");

const formWrap = document.getElementById("project-form-wrap");
const form = document.getElementById("project-form");
const formTitle = document.getElementById("form-title");
const formError = document.getElementById("form-error");
const cancelBtn = document.getElementById("cancel-btn");
const saveBtn = document.getElementById("save-btn");

const fieldId = document.getElementById("field-id");
const fieldName = document.getElementById("field-name");
const fieldClient = document.getElementById("field-client");
const fieldIndustry = document.getElementById("field-industry");
const fieldRole = document.getElementById("field-role");
const fieldDuration = document.getElementById("field-duration");
const fieldTechTags = document.getElementById("field-tech-tags");
const fieldProblem = document.getElementById("field-problem");
const fieldBuilt = document.getElementById("field-built");
const fieldImpact = document.getElementById("field-impact");
const fieldScreenshot = document.getElementById("field-screenshot");
const fieldScreenshotPreview = document.getElementById("field-screenshot-preview");
const fieldVideo = document.getElementById("field-video");
const fieldTestimonial = document.getElementById("field-testimonial");
const fieldTestimonialName = document.getElementById("field-testimonial-name");
const fieldTestimonialLinkedin = document.getElementById("field-testimonial-linkedin");
const fieldPublished = document.getElementById("field-published");

let projects = [];
let pendingScreenshotFile = null;
let existingScreenshotUrl = "";

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
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

function showLogin() {
  loginScreen.hidden = false;
  adminPanel.hidden = true;
  logoutBtn.hidden = true;
}

function showPanel() {
  loginScreen.hidden = true;
  adminPanel.hidden = false;
  logoutBtn.hidden = false;
  loadAndRenderList();
}

async function loadAndRenderList() {
  listStatus.textContent = "Loading…";
  try {
    projects = await loadAllProjects();
    renderList();
    listStatus.textContent = projects.length ? "" : "No case studies yet — add your first one.";
  } catch (err) {
    listStatus.textContent = `Failed to load case studies: ${err.message}`;
  }
}

function rowHtml(project, index, total) {
  return `
    <div class="admin-row" data-id="${project.id}">
      <div class="admin-row-thumb">
        ${
          project.screenshot_url
            ? `<img src="${escapeHtml(project.screenshot_url)}" alt="" />`
            : "—"
        }
      </div>
      <div class="admin-row-info">
        <span class="admin-row-name">${escapeHtml(project.name)}</span>
        <span class="badge ${project.published ? "badge-published" : "badge-draft"}">
          ${project.published ? "Published" : "Draft"}
        </span>
      </div>
      <div class="admin-row-actions">
        <button class="btn-icon" type="button" data-action="up" aria-label="Move up" ${index === 0 ? "disabled" : ""}>↑</button>
        <button class="btn-icon" type="button" data-action="down" aria-label="Move down" ${index === total - 1 ? "disabled" : ""}>↓</button>
        <button class="btn btn-secondary" type="button" data-action="edit">Edit</button>
        <button class="btn btn-secondary" type="button" data-action="delete">Delete</button>
      </div>
    </div>
  `;
}

function renderList() {
  adminList.innerHTML = projects.map((p, i) => rowHtml(p, i, projects.length)).join("");
}

function resetForm() {
  form.reset();
  fieldId.value = "";
  pendingScreenshotFile = null;
  existingScreenshotUrl = "";
  fieldScreenshotPreview.hidden = true;
  fieldScreenshotPreview.src = "";
  formError.textContent = "";
}

function openForm(project) {
  resetForm();

  if (project) {
    formTitle.textContent = "Edit case study";
    fieldId.value = project.id;
    fieldName.value = project.name ?? "";
    fieldClient.value = project.client ?? "";
    fieldIndustry.value = project.industry ?? "";
    fieldRole.value = project.role ?? "";
    fieldDuration.value = project.duration ?? "";
    fieldTechTags.value = (project.tech_tags ?? []).join(", ");
    fieldProblem.value = project.problem ?? "";
    fieldBuilt.value = project.built ?? "";
    fieldImpact.value = project.impact ?? "";
    fieldVideo.value = project.video_url ?? "";
    fieldTestimonial.value = project.testimonial ?? "";
    fieldTestimonialName.value = project.testimonial_name ?? "";
    fieldTestimonialLinkedin.value = project.testimonial_linkedin_url ?? "";
    fieldPublished.checked = Boolean(project.published);

    existingScreenshotUrl = project.screenshot_url ?? "";
    if (existingScreenshotUrl) {
      fieldScreenshotPreview.src = existingScreenshotUrl;
      fieldScreenshotPreview.hidden = false;
    }
  } else {
    formTitle.textContent = "Add case study";
    fieldPublished.checked = false;
  }

  formWrap.hidden = false;
  formWrap.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeForm() {
  formWrap.hidden = true;
  resetForm();
}

async function handleDelete(project) {
  if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;

  try {
    await deleteProject(project.id);
    showToast("Case study deleted.");
    await loadAndRenderList();
  } catch (err) {
    showToast(`Delete failed: ${err.message}`, "error");
  }
}

async function handleReorder(project, direction) {
  const index = projects.findIndex((p) => p.id === project.id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= projects.length) return;

  const reordered = [...projects];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

  try {
    await Promise.all(reordered.map((p, i) => updateSortOrder(p.id, i)));
    showToast("Reordered.");
    await loadAndRenderList();
  } catch (err) {
    showToast(`Reorder failed: ${err.message}`, "error");
  }
}

adminList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const row = button.closest(".admin-row");
  const project = projects.find((p) => p.id === row.dataset.id);
  if (!project) return;

  const action = button.dataset.action;
  if (action === "edit") openForm(project);
  else if (action === "delete") handleDelete(project);
  else if (action === "up" || action === "down") handleReorder(project, action);
});

addBtn.addEventListener("click", () => openForm(null));
cancelBtn.addEventListener("click", closeForm);

fieldScreenshot.addEventListener("change", () => {
  const file = fieldScreenshot.files[0];
  if (!file) return;

  pendingScreenshotFile = file;
  fieldScreenshotPreview.src = URL.createObjectURL(file);
  fieldScreenshotPreview.hidden = false;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";

  try {
    let screenshotUrl = existingScreenshotUrl;
    if (pendingScreenshotFile) {
      screenshotUrl = await uploadProjectImage(pendingScreenshotFile);
    }

    const payload = {
      name: fieldName.value.trim(),
      client: fieldClient.value.trim() || null,
      industry: fieldIndustry.value.trim() || null,
      role: fieldRole.value.trim() || null,
      duration: fieldDuration.value.trim() || null,
      tech_tags: fieldTechTags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      problem: fieldProblem.value.trim() || null,
      built: fieldBuilt.value.trim() || null,
      impact: fieldImpact.value.trim() || null,
      screenshot_url: screenshotUrl || null,
      video_url: fieldVideo.value.trim() || null,
      testimonial: fieldTestimonial.value.trim() || null,
      testimonial_name: fieldTestimonialName.value.trim() || null,
      testimonial_linkedin_url: fieldTestimonialLinkedin.value.trim() || null,
      published: fieldPublished.checked,
    };

    if (fieldId.value) {
      payload.id = fieldId.value;
    } else {
      payload.sort_order = projects.length;
    }

    await saveProject(payload);
    showToast("Case study saved.");
    closeForm();
    await loadAndRenderList();
  } catch (err) {
    formError.textContent = err.message;
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save";
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  try {
    await signIn(loginEmail.value.trim(), loginPassword.value);
    loginPassword.value = "";
  } catch (err) {
    loginError.textContent = "Login failed — check your email and password.";
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut();
});

onAuthChange((session) => {
  if (session) showPanel();
  else showLogin();
});
