# Shank Strategy Ops Web

The official business website and digital presence for **Shank Strategy Ops LLC**. 

This project serves as a high-performance, modern platform for "Execution leadership for complex businesses," integrating strategic content delivery with advanced UI/UX.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend**: [Express 5](https://expressjs.com/) (Node.js)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API**: Integrated [Resend](https://resend.com/) for contact and messaging
- **Infrastructure**: Configured for [Vercel](https://vercel.com/) deployment

## 📁 Project Structure

- `client/`: React frontend application. `client/src/entry-server.tsx` is the build-time render entry.
- `server/`: Express static-file server for local production previews only (`pnpm start`). It is not SSR.
- `api/`: Serverless function endpoints (e.g., contact form).
- `scripts/`: Custom automation — sitemap generation, per-route HTML prerendering (`generate-route-html.ts`), the prerender build gate (`verify-prerender.ts`), and an **Ad Rendering** engine (`render-ad.ts`).
- `shared/`: Shared constants and types between client and server.
- `docs/`: Technical documentation and engagement models.
- `out/`: Build and generated asset output (including Sora video assets).

## 🛠️ Development

### Prerequisites
- Node.js >= 20
- [pnpm](https://pnpm.io/)

### Getting Started
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in required keys (Vite/Resend)
3. Start the development server:
   ```bash
   pnpm dev
   ```

### Building for Production
```bash
pnpm build
```

`pnpm build` runs six steps in order:

1. `generate:sitemap` — writes `client/public/sitemap.xml` from the route table.
2. `vite build` — the client bundle into `dist/public`.
3. `build:ssr` — compiles `client/src/entry-server.tsx` into `dist/server`.
4. `generate:route-html` — writes one `dist/public/<route>/index.html` per route with
   per-route `<head>` metadata **and** real prerendered body HTML in `#root`.
5. `verify:prerender` — fails the build if any route lost its body content, its title,
   or renders the same markup as another route.
6. `generate:llms` — writes `client/public/llms-full.txt` (the full text of every
   substantive page, in one fetch) and refreshes the `## Writing` index inside
   `client/public/llms.txt`, then copies both into `dist/public`.

Step 6 reads the prerendered HTML from step 4 rather than the data modules, because
most page copy is literal JSX with no data module behind it. It extracts each page's
`<main>` element, so the nav and footer that repeat on every route stay out. Every page
must therefore render exactly one `<main>` — the build fails if one doesn't.

Hand-written prose in `llms.txt` is preserved; only the block between
`<!-- generated:writing -->` markers is rewritten.

The site is a client-rendered SPA that ships prerendered HTML, so crawlers and LLM
fetchers that do not execute JavaScript still get the full page text. The client
**hydrates** that markup (`client/src/main.tsx`), so anything rendered during the build
must produce identical output in the browser — notably, format dates with an explicit
`timeZone` (see `client/src/lib/dates.ts`) rather than the viewer's local zone.

> `pnpm start` serves the root `index.html` for every path, so it will **not** show
> per-route prerendering. Inspect `dist/public/<route>/index.html` directly, or use a
> static server that resolves directory index files.

## 🧠 Strategic Assets
This repository contains more than just code; it includes strategic frameworks used by the business:
- `EngagementModel.md`: Details on how Shank Strategy Ops interacts with clients.
- `ideas.md`: Roadmap and conceptual evolution of the platform.
- `AGENTS.md`: Configuration or notes regarding AI agent integration within the site.

---
© 2026 Shank Strategy Ops LLC. Proprietary and Confidential.
