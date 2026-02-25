# Workspace setup — Shank Strategy Ops Web

Use this as the single place to check environment, tools, and what you need to do (connectors, Vercel, keys).

---

## 1. Prerequisites (your machine)

| Tool | Purpose | Check |
|------|---------|--------|
| **Node.js** | Build and run (Vercel uses 20.x) | `node -v` → prefer 20.x |
| **pnpm** | Package manager (lockfile is pnpm) | `pnpm -v` |
| **Git** | Branches / Vercel deploys | `git -v` |

- If you don’t have pnpm: `npm install -g pnpm`
- Node: use 20 LTS if possible (matches Vercel). Optional: add `.nvmrc` with `20` and run `nvm use`.

---

## 2. One-time local setup

```bash
# From repo root
pnpm install
pnpm run build    # Confirms build works (Vercel runs this too)
pnpm run dev      # Dev server at http://localhost:3000
```

- **Build:** `vite build` outputs to `dist/public`; Vercel deploys that folder.
- **Optional:** The script also bundles the Express server (`server/index.ts`) into `dist/index.js` for local `pnpm start`; Vercel does not use that.

---

## 3. Environment variables

Copy `.env.example` to `.env.local` for local dev. **Do not commit** `.env` or `.env.local` (they’re in `.gitignore`).

### Where to set them

| Where | When |
|-------|--------|
| **Vercel** | Project → Settings → Environment Variables. Set for Production (and Preview if you want). |
| **Local** | `.env.local` in repo root (create from `.env.example`). |

### Variables (see `.env.example`)

- **Contact form (Resend):** `RESEND_API_KEY`, `CONTACT_EMAIL` (and optional `RESEND_FROM_EMAIL`).
- **Maps (if you use Map):** `VITE_FRONTEND_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL` (client-side, so `VITE_` prefix).
- **Legacy (can remove if unused):** Any `VITE_OAUTH_*` / `VITE_APP_ID` from old Manus auth are no longer used.

---

## 4. Connectors / services (what you do)

### Email (contact form → your inbox)

- **Resend** (recommended): [resend.com](https://resend.com) → sign up, create API key, add a domain (or use their sandbox “onboarding@resend.dev” for testing).
- In **Vercel**: add `RESEND_API_KEY` and `CONTACT_EMAIL` (the address that receives the form submissions).
- The serverless function lives in `api/contact.ts` and only runs when the form POSTs to `/api/contact`.

### Vercel

- Connect the repo (GitHub/GitLab/Bitbucket). Pushes to main (or your production branch) deploy automatically.
- **Build command:** `pnpm install && pnpm run build` (already in `vercel.json`).
- **Output directory:** `dist/public`.
- **Env vars:** Add the same variables you use locally (see above); no `VITE_` needed for server-side keys like `RESEND_API_KEY`.

### Optional: Maps

- If you use the Map component, configure Frontend Forge (or your map provider) and set `VITE_FRONTEND_FORGE_API_KEY` and `VITE_FRONTEND_FORGE_API_URL` in Vercel and in `.env.local`.

---

## 5. Recommended next steps

1. **Confirm workspace**
   - Run `pnpm install && pnpm run build` and fix any errors.
   - Add env vars in Vercel (and `.env.example` → `.env.local` locally).

2. **Contact form**
   - Resend: create account, get API key, set `RESEND_API_KEY` and `CONTACT_EMAIL` in Vercel.
   - Frontend: add a contact form that POSTs to `/api/contact` (or keep mailto and add the API for a future form).

3. **Vercel behavior**
   - Each push to the production branch triggers a new build and deploy.
   - Preview deployments: other branches/PRs get their own URLs; use the same env vars for Preview if you want the form to work there.

4. **Optional cleanup**
   - If you never run the Express server locally, you can simplify `package.json` build to only `vite build` and use `preview` for local static testing.

---

## 6. Project layout (reference)

```
api/
  contact.ts          # Vercel serverless: POST → send email (Resend)
client/
  src/
    pages/            # Home, Blog, Products, etc.
    components/      # UI + blog nav, etc.
    contexts/
    lib/
dist/
  public/             # Vite build output (what Vercel deploys)
  index.js            # Express bundle (local only, optional)
server/
  index.ts            # Express static server (local only)
shared/
  const.ts
vercel.json           # Build command, output dir, SPA rewrites
.env.example          # Template for env vars (commit this)
```

---

*Last updated after Manus removal and Vercel-focused setup.*
