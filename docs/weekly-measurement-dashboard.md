# Weekly Measurement Dashboard

Review these numbers once per week and note what changed, what likely caused it,
and what should be adjusted next.

## Data Sources

- **Google tag:** `client/index.html` loads `GT-MR5X4ZRK` and configures
  `AW-18044101045`. Use this for aggregate traffic, landing-page, campaign, and
  Google Ads reporting.
- **Vercel Analytics events:** `client/src/lib/analytics.ts` wraps
  `@vercel/analytics/react` with `trackEvent(...)`. Use this for product,
  content, contact, and Operator Audit funnel actions.
- **Contact API outcomes:** both the contact form and Operator Audit intake POST
  to `POST /api/contact`, implemented in `api/contact.ts`.

Do not assume custom Vercel events also appear in Google Analytics. Treat Google
tag reporting and Vercel event reporting as separate sources unless a later
implementation explicitly bridges them.

## Core Questions

- Which landing pages brought the most qualified visitors into the site?
- Which CTA surfaces earned clicks: home hero, blog CTA blocks, tools CTA
  blocks, or the Operator Audit page?
- How many standard contact submissions succeeded, and how many failed?
- How many Operator Audit intakes succeeded, and how many failed?
- Which essays, tools, or service pages assisted a later contact or audit
  submission?

## Event Catalog

| Event | Emitted from | Useful properties | Use it to answer |
| --- | --- | --- | --- |
| `Hero CTA Clicked` | Home hero CTA | `source` | Does the home hero move visitors toward the contact section? |
| `Blog CTA Clicked` | Blog/essay CTA blocks | `source` | Which writing surfaces generate consult intent? |
| `Tool CTA Clicked` | Tools page CTA block | `source` | Does the tools page move readers toward consulting? |
| `Tool Outbound Clicked` | Tool repository/package/product links | `product`, `destination` | Which open-source/product links earn outbound interest? |
| `Contact Submit Succeeded` | Standard contact form | `source: "contact-form"` | How many regular inquiries reached the inbox workflow? |
| `Contact Submit Failed` | Standard contact form | `reason` | Where the standard contact funnel is blocked. |
| `Operator Audit CTA Clicked` | Operator Audit hero CTA | `target: "intake"` | Whether the paid-service page moves visitors into the intake section. |
| `Operator Audit Submit Succeeded` | Operator Audit intake form | `source: "operator-audit-intake"` | How many audit intakes reached the inbox workflow? |
| `Operator Audit Submit Failed` | Operator Audit intake form | `reason` | Where the paid-service intake funnel is blocked. |

Common failure reasons include `missing-turnstile-token`, `network-error`,
`message-too-long`, an API error string returned by `/api/contact`, or an
`http-<status>` fallback when the response does not include a string error.

## Contact and Operator Audit Intake Constraints

Both forms share `api/contact.ts`; the Operator Audit form packages structured
answers into the `message` body and marks the submitted name as an Operator
Audit intake. When diagnosing failed submissions, check these constraints before
treating the failure as user intent:

- Required server env: `RESEND_API_KEY` and `CONTACT_EMAIL`.
- Optional server env: `RESEND_FROM_EMAIL` and `TURNSTILE_SECRET_KEY`.
- Optional browser env: `VITE_TURNSTILE_SITE_KEY`; when present, the form
  requires a Turnstile token before POSTing.
- Request must be same-origin JSON (`Content-Type: application/json`).
- Body limit: 16 KB.
- Payload limits: `email` must be valid, `message` must be 10-5000 characters,
  and `name` is capped at 120 characters.
- Rate limit: 8 requests per 10-minute window per client IP.
- If `TURNSTILE_SECRET_KEY` is set server-side, `/api/contact` rejects requests
  without a valid `turnstileToken`.

## Weekly Review Workflow

1. In Google reporting, capture top landing pages, campaign/source changes, and
   paid traffic signals tied to `GT-MR5X4ZRK` / `AW-18044101045`.
2. In Vercel Analytics, capture the event counts in the catalog above.
3. Split standard contact submissions from Operator Audit submissions. They use
   the same backend route, but their events and message bodies represent
   different funnels.
4. Review failed submit events by `reason`. Repeated `missing-turnstile-token`,
   `Bot check failed`, `Contact form is not configured.`, or rate-limit errors
   indicate setup or friction to investigate.
5. Write one short hypothesis for the week and one adjustment, if any.

## Weekly Snapshot Template

| Week of | Top landing pages | Hero CTA | Blog CTA | Tool CTA | Tool outbound | Contact succeeds / fails | Audit CTA | Audit succeeds / fails | Notes / hypotheses |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD |  |  |  |  |  |  |  |  |  |

## Review Notes

- Look for pages with strong traffic but weak CTA movement. Those are messaging
  candidates.
- Look for blog posts, tools pages, or Operator Audit sections with strong CTA
  movement. Those are service-fit indicators.
- Look for repeated contact or audit failures by reason. Those are funnel
  friction, not user problems.
