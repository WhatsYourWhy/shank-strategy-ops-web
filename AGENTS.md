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
the wrong title, or markup identical to another route.

### llms.txt

`pnpm generate:llms` derives `client/public/llms-full.txt` and the `## Writing` index in
`client/public/llms.txt` from the prerendered HTML, by extracting each page's `<main>`
element. Two consequences:

- Every page must render exactly one `<main>`, with nav and footer outside it. The build
  fails otherwise.
- Never hand-edit `llms-full.txt`, or the block between the `<!-- generated:writing -->`
  markers in `llms.txt`. The rest of `llms.txt` is hand-written and is preserved.

### Gotchas

- pnpm 10.x requires explicit build-script approval. The `pnpm.onlyBuiltDependencies` field in `package.json` whitelists `@tailwindcss/oxide`, `esbuild`, and `ffmpeg-static`. Without this, native binaries won't be downloaded and builds will fail.
- The `pnpm format` script runs `prettier --write .` (not `--check`), so running it will modify files in-place.
- Environment variables for the contact form API (`RESEND_API_KEY`, `CONTACT_EMAIL`) are optional for local dev — the site loads and navigates without them.
- Path aliases: `@` → `client/src`, `@shared` → `shared/`, `@assets` → `attached_assets/`.
