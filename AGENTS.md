# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Shank Strategy Ops Web (`shank-strategy-ops-web`) is a React + Vite + TypeScript SPA for a consulting firm website. It uses pnpm (v10.4.1) as its package manager and requires Node >= 20.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `pnpm dev` | 3000 | Main dev server with HMR; serves the client SPA |

The Express server (`pnpm start`) is for local production previews only — run `pnpm build` first.

### Key commands

See `package.json` `scripts` for the full list. Summary:

- **Dev server:** `pnpm dev` (Vite on port 3000)
- **Type check:** `pnpm check` (`tsc --noEmit`)
- **Format:** `pnpm format` (Prettier — note: this runs `--write` by default)
- **Build:** `pnpm build` (sitemap → Vite client build → Vite SSR build → per-route HTML prerender → prerender verification → llms.txt generation → esbuild server bundle)

There is no ESLint config; only Prettier is used for formatting.

### Prerendering

`pnpm build` renders every route to static HTML at build time (`client/src/entry-server.tsx` →
`scripts/generate-route-html.ts`) and the client hydrates it (`client/src/main.tsx`). Two consequences:

- Anything rendered during the build must render identically in the browser, or hydration breaks.
  Locale/timezone-dependent formatting is the usual culprit — use `client/src/lib/dates.ts`.
- Page components must not touch `window`/`document`/`localStorage` outside of effects.

`pnpm verify:prerender` runs inside `pnpm build` and fails it if a route ships an empty body,
the wrong title, markup identical to another route, or a missing/indexable `404.html`.

`pnpm check:hydration` proves the emitted HTML actually *works* in a browser, which
`pnpm build` and `tsc` cannot: it serves `dist/public` the way Vercel does, loads all 22
routes in headless Chromium, and fails on a React hydration mismatch, an uncaught
exception, a route that never hydrated, or a route without exactly one
`<main id="main-content">`. It needs a build first (`pnpm build && pnpm check:hydration`)
and Chromium (`pnpm exec playwright install chromium`). CI runs it on every PR — this is
the only check that catches a dependency bump breaking the client render.

### Routing

`vercel.json` has **no catch-all rewrite** — every route is prerendered to its own file, so
Vercel serves the filesystem and falls back to `dist/public/404.html` with a real 404 status.

- Any new route must be prerendered to be reachable. Add it to `staticRenderablePaths` in
  `client/src/lib/pageMetadata.ts` (or to the blog data); the build emits and verifies it.
- Do not add a `/(.*)` → `/index.html` rewrite back. It made every unknown URL answer 200
  with a full copy of the home page.

### llms.txt

`pnpm generate:llms` derives `client/public/llms-full.txt` and the `## Writing` index in
`client/public/llms.txt` from the prerendered HTML, by extracting each page's `<main>`
element. Two consequences:

- Every page must render exactly one `<main>`, with nav and footer outside it. The build
  fails otherwise.
- Never hand-edit `llms-full.txt`, or the `## Writing` section of `llms.txt` — that
  section is rewritten from its heading to the next `## ` heading on every build. The
  rest of `llms.txt` is hand-written and is preserved.

### Gotchas

- pnpm 10.x requires explicit build-script approval. The `pnpm.onlyBuiltDependencies` field in `package.json` whitelists `@tailwindcss/oxide`, `esbuild`, and `ffmpeg-static`. Without this, native binaries won't be downloaded and builds will fail.
- The `pnpm format` script runs `prettier --write .` (not `--check`), so running it will modify files in-place.
- Environment variables for the contact form API (`RESEND_API_KEY`, `CONTACT_EMAIL`) are optional for local dev — the site loads and navigates without them.
- Path aliases: `@` → `client/src`, `@shared` → `shared/`, `@assets` → `attached_assets/`.
