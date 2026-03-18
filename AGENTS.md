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
- **Build:** `pnpm build` (Vite build + esbuild server bundle)

There is no ESLint config; only Prettier is used for formatting.

### Gotchas

- pnpm 10.x requires explicit build-script approval. The `pnpm.onlyBuiltDependencies` field in `package.json` whitelists `@tailwindcss/oxide`, `esbuild`, and `ffmpeg-static`. Without this, native binaries won't be downloaded and builds will fail.
- The `pnpm format` script runs `prettier --write .` (not `--check`), so running it will modify files in-place.
- Environment variables for the contact form API (`RESEND_API_KEY`, `CONTACT_EMAIL`) are optional for local dev — the site loads and navigates without them.
- Path aliases: `@` → `client/src`, `@shared` → `shared/`, `@assets` → `attached_assets/`.
