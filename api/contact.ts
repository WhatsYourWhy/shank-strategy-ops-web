/**
 * Vercel serverless function: POST /api/contact
 * Sends contact form payload to CONTACT_EMAIL via Resend.
 *
 * Body (JSON): { name?: string, email: string, message: string, turnstileToken?: string }
 * Env: RESEND_API_KEY, CONTACT_EMAIL, optional RESEND_FROM_EMAIL, optional TURNSTILE_SECRET_KEY
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.RESEND_FROM_EMAIL || "Shank Strategy Ops <onboarding@resend.dev>";
const TO = process.env.CONTACT_EMAIL;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(request: Request) {
  if (!TO || !process.env.RESEND_API_KEY) {
    return Response.json(
      { error: "Contact form is not configured." },
      { status: 503 }
    );
  }

  let body: {
    name?: string;
    email?: string;
    message?: string;
    turnstileToken?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, message, turnstileToken } = body;
  if (!email || typeof email !== "string" || !message || typeof message !== "string") {
    return Response.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }

  if (TURNSTILE_SECRET) {
    if (!turnstileToken || typeof turnstileToken !== "string") {
      return Response.json(
        { error: "Bot check is required before sending." },
        { status: 400 }
      );
    }

    const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    let turnstileResult: TurnstileVerifyResponse;

    try {
      turnstileResult = await verifyTurnstileToken(turnstileToken, remoteIp);
    } catch {
      return Response.json(
        { error: "Bot check verification failed. Please try again." },
        { status: 502 }
      );
    }

    if (!turnstileResult.success) {
      return Response.json(
        { error: "Bot check failed. Please try again." },
        { status: 400 }
      );
    }
  }

  const MAX_MESSAGE_LENGTH = 5000;
  const MAX_EMAIL_LENGTH = 254;
  const trimmedMessage = message.slice(0, MAX_MESSAGE_LENGTH);
  const trimmedEmail = email.slice(0, MAX_EMAIL_LENGTH);
  const safeName = typeof name === "string" ? name.slice(0, 120) : "-";
  const subject = `Contact form: ${safeName} (${trimmedEmail})`;

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: trimmedEmail,
    subject,
    text: trimmedMessage,
    html: [
      `<p><strong>From:</strong> ${escapeHtml(safeName)} &lt;${escapeHtml(trimmedEmail)}&gt;</p>`,
      `<p><strong>Message:</strong></p>`,
      `<pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(trimmedMessage)}</pre>`,
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

async function verifyTurnstileToken(token: string, remoteIp?: string) {
  if (!TURNSTILE_SECRET) {
    return { success: true } satisfies TurnstileVerifyResponse;
  }

  const body = new URLSearchParams({
    secret: TURNSTILE_SECRET,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Turnstile verify failed with status ${response.status}`);
  }

  return (await response.json()) as TurnstileVerifyResponse;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}
