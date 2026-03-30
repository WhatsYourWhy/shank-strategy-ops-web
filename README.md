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

- `client/`: React frontend application.
- `server/`: Express backend (handling SSR and API logic).
- `api/`: Serverless function endpoints (e.g., contact form).
- `scripts/`: Custom automation, including an **Ad Rendering** engine (`render-ad.ts`).
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

## 🧠 Strategic Assets
This repository contains more than just code; it includes strategic frameworks used by the business:
- `EngagementModel.md`: Details on how Shank Strategy Ops interacts with clients.
- `ideas.md`: Roadmap and conceptual evolution of the platform.
- `AGENTS.md`: Configuration or notes regarding AI agent integration within the site.

---
© 2026 Shank Strategy Ops LLC. Proprietary and Confidential.
