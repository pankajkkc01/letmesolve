// Enquiry form -> POST /api/enquiry. Shows inline errors, blocks double-submit,
// and reports success/failure through the shared toast.

const ENDPOINT = "/api/enquiry";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIELDS = ["name", "email", "company", "problem", "heard"];

function setFieldError(form, name, message) {
  const input = form.elements[name];
  const field = input?.closest(".form-field");
  if (!field) return;
  field.querySelector(".field-error")?.remove();
  input.removeAttribute("aria-invalid");
  if (!message) return;

  const el = document.createElement("p");
  el.className = "field-error";
  el.textContent = message;
  field.appendChild(el);
  input.setAttribute("aria-invalid", "true");
}

function validate(form) {
  const errors = {};
  if (!form.elements.name.value.trim()) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(form.elements.email.value.trim())) errors.email = "Please enter a valid email address.";
  if (!form.elements.company.value.trim()) errors.company = "Please enter your company.";
  return errors;
}

export function initContactForm(showToast) {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return; // double-submit guard

    FIELDS.forEach((f) => setFieldError(form, f, ""));
    const errors = validate(form);
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([f, msg]) => setFieldError(form, f, msg));
      form.elements[Object.keys(errors)[0]].focus();
      return;
    }

    const label = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        form.reset();
        showToast("Thanks! I've got your message and will reply soon.", "success");
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([f, msg]) => setFieldError(form, f, msg));
      } else {
        showToast(result.error || "Something went wrong. Please email info@letmesolve.in.", "error");
      }
    } catch {
      showToast("Couldn't reach the server. Please email info@letmesolve.in.", "error");
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
}
