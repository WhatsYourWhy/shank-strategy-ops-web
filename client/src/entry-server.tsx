import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

/**
 * Server entry used by `scripts/generate-route-html.ts` to prerender real body
 * HTML for every route at build time.
 *
 * The `<Router ssrPath>` wrapper is load-bearing: wouter's browser location
 * hook falls back to "/" when there is no `window`, so without it every route
 * would render the Home page. On the client there is no wrapper, so `App`
 * keeps using the browser location exactly as before.
 *
 * Do not import `main.tsx` here — it touches `document` at module scope.
 */
export function render(path: string): string {
  return renderToString(
    <Router ssrPath={path}>
      <App />
    </Router>
  );
}
