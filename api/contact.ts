/**
 * Vercel serverless function: POST /api/contact
 * Sends contact form payload to CONTACT_EMAIL via Resend.
 *
 * Body (JSON): { name?: string, email: string, message: string }
 * Env: RESEND_API_KEY, CONTACT_EMAIL, optional RESEND_FROM_EMAIL
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.RESEND_FROM_EMAIL || "Shank Strategy Ops <onboarding@resend.dev>";
const TO = process.env.CONTACT_EMAIL;

export async function POST(request: Request) {
  if (!TO || !process.env.RESEND_API_KEY) {
    return Response.json(
      { error: "Contact form is not configured." },
      { status: 503 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { name, email, message } = body;
  if (!email || typeof email !== "string" || !message || typeof message !== "string") {
    return Response.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }

  const safeName = typeof name === "string" ? name : "—";
  const subject = `Contact form: ${safeName} (${email})`;

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: email,
    subject,
    text: message,
    html: [
      `<p><strong>From:</strong> ${escapeHtml(safeName)} &lt;${escapeHtml(email)}&gt;</p>`,
      `<p><strong>Message:</strong></p>`,
      `<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>`,
    ].join(""),
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json(
      { error: "Failed to send message. Please try again or email directly." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, id: data?.id }, { status: 200 });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
