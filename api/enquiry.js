// POST /api/enquiry — validate -> save to Supabase -> Mailjet auto-reply + notification.
// Secrets (service key, Mailjet keys) are read from Vercel env vars and never reach the browser.

const LIMITS = { name: 100, email: 200, company: 150, problem: 3000, heard: 200 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (value, max) => String(value ?? "").trim().slice(0, max);
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function validate(body) {
  const data = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    company: clean(body.company, LIMITS.company),
    problem: clean(body.problem, LIMITS.problem),
    heard: clean(body.heard, LIMITS.heard),
  };
  const errors = {};
  if (!data.name) errors.name = "Please enter your name.";
  if (!data.company) errors.company = "Please enter your company.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  return { data, errors };
}

async function saveEnquiry(data) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/enquiries`, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      company: data.company,
      problem: data.problem || null,
      heard_from: data.heard || null,
    }),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
}

async function sendEmails(data) {
  const from = process.env.MAIL_FROM;
  const notify = process.env.MAIL_NOTIFY;
  const auth = Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`).toString("base64");
  const firstName = data.name.split(" ")[0];

  const messages = [
    {
      // Auto-reply to the visitor
      From: { Email: from, Name: "Pankaj — letmesolve" },
      To: [{ Email: data.email, Name: data.name }],
      Subject: "Got your message — I'll be in touch soon",
      TextPart:
        `Hi ${firstName},\n\n` +
        `Thanks for reaching out about ${data.company}. I've received your message and will read it personally.\n` +
        `I'll get back to you within 1–2 working days with an honest take on whether I can help.\n\n` +
        `— Pankaj\nletmesolve.in`,
      HTMLPart:
        `<p>Hi ${escapeHtml(firstName)},</p>` +
        `<p>Thanks for reaching out about <strong>${escapeHtml(data.company)}</strong>. I've received your message and will read it personally.</p>` +
        `<p>I'll get back to you within 1–2 working days with an honest take on whether I can help.</p>` +
        `<p>— Pankaj<br><a href="https://letmesolve.in">letmesolve.in</a></p>`,
    },
    {
      // Notification to you; Reply-To lets you answer straight from your inbox
      From: { Email: from, Name: "letmesolve enquiries" },
      To: [{ Email: notify }],
      ReplyTo: { Email: data.email, Name: data.name },
      Subject: `New enquiry: ${data.name} (${data.company})`,
      TextPart:
        `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\n` +
        `Heard from: ${data.heard || "—"}\n\nProblem:\n${data.problem || "—"}`,
    },
  ];

  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ Messages: messages }),
  });
  if (!res.ok) throw new Error(`Mailjet send failed: ${res.status} ${await res.text()}`);
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};

  // Honeypot: real visitors never see/fill this field. Pretend success so bots move on.
  if (body.website) return res.status(200).json({ ok: true });

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Please check the form.", errors });

  try {
    await saveEnquiry(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Couldn't save your message. Please email info@letmesolve.in." });
  }

  // The enquiry is already saved, so a mail failure shouldn't fail the visitor's submission.
  try {
    await sendEmails(data);
  } catch (err) {
    console.error(err);
  }

  return res.status(200).json({ ok: true });
}
