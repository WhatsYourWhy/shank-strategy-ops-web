/**
 * Vercel serverless function: POST /api/contact
 * Sends contact form payload to CONTACT_EMAIL via Resend.
 *
 * Body (JSON): { name?: string, email: string, message: string, turnstileToken?: string }
 * Env: RESEND_API_KEY, CONTACT_EMAIL, optional RESEND_FROM_EMAIL, optional TURNSTILE_SECRET_KEY
 */

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.RESEND_FROM_EMAIL || "Shank Strategy Ops <onboarding@resend.dev>";
const TO = process.env.CONTACT_EMAIL;
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_REQUEST_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

const ContactPayloadSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  turnstileToken: z.string().trim().min(1).max(2048).optional(),
});

const rateLimitStore = new Map<string, { count: number; windowStartMs: number }>();

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(request: Request) {
  if (!TO || !process.env.RESEND_API_KEY) {
    return json(
      { error: "Contact form is not configured." },
      503
    );
  }

  if (!isSameOriginRequest(request)) {
    return json({ error: "Invalid request origin." }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ error: "Content-Type must be application/json." }, 415);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const length = Number.parseInt(contentLength, 10);
    if (!Number.isFinite(length)) {
      return json({ error: "Invalid Content-Length header." }, 400);
    }
    if (length > MAX_REQUEST_BODY_BYTES) {
      return json({ error: "Request body is too large." }, 413);
    }
  }

  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      429
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const parsedBody = ContactPayloadSchema.safeParse(body);
  if (!parsedBody.success) {
    return json({ error: "Invalid form payload." }, 400);
  }
  const { name, email, message, turnstileToken } = parsedBody.data;

  if (TURNSTILE_SECRET) {
    if (!turnstileToken) {
      return json({ error: "Bot check is required before sending." }, 400);
    }

    let turnstileResult: TurnstileVerifyResponse;

    try {
      turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp);
    } catch {
      return json(
        { error: "Bot check verification failed. Please try again." },
        502
      );
    }

    if (!turnstileResult.success) {
      return json(
        { error: "Bot check failed. Please try again." },
        400
      );
    }
  }

  const safeName = sanitizeHeaderValue(name && name.length > 0 ? name : "-");
  const trimmedEmail = sanitizeHeaderValue(email).toLowerCase();
  const trimmedMessage = message;
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
    return json(
      { error: "Failed to send message. Please try again or email directly." },
      500
    );
  }

  return json({ ok: true, id: data?.id }, 200);
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

function json(payload: unknown, status: number): Response {
  return Response.json(payload, { status, headers: NO_STORE_HEADERS });
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (forwardedFor) {
    return forwardedFor;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim();
  if (!host) {
    return false;
  }

  return originUrl.host === host;
}

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();

  // Keep map bounded in long-lived runtimes.
  for (const [ip, state] of rateLimitStore) {
    if (now - state.windowStartMs > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitStore.delete(ip);
    }
  }

  const current = rateLimitStore.get(clientIp);
  if (!current || now - current.windowStartMs > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientIp, { count: 1, windowStartMs: now });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(clientIp, current);
  return false;
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
}
