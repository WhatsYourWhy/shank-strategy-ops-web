import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  getAllRenderablePageMetadata,
  resolvePageMetadata,
} from "../client/src/lib/pageMetadata";
import { escapeHtml, findRootSpan } from "./html";

/**
 * Build gate for the prerender step.
 *
 * The repo has no CI and no test suite, and a prerender that silently
 * regressed to an empty <div id="root"></div> would look exactly like a
 * healthy build. This runs inside `pnpm build` (and therefore inside the
 * Vercel build) and fails it if any route stops shipping real body HTML.
 *
 * It also catches the failure modes that would otherwise pass a naive
 * "is the body non-empty" check:
 *   - a missing wouter `ssrPath`, which renders Home into every route
 *   - a change to the output layout that collapses every route back to the
 *     generic shell
 *   - a missing 404.html, which would send unmatched paths somewhere with a 200
 */

const MIN_BODY_TEXT_CHARS = 500;

/** The 404 page is intentionally sparse — a heading, a line, and a link home. */
const MIN_404_TEXT_CHARS = 40;

function getRouteOutputPath(distDir: string, routePath: string) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, routePath.slice(1), "index.html");
}

/**
 * Plain text rendered inside #root.
 *
 * Scoped to the root div's own contents rather than the rest of the file, so
 * the page's <script> and <style> tags — all of which Vite puts in <head> —
 * are excluded by construction instead of by stripping them back out.
 */
function extractRootText(html: string) {
  const root = findRootSpan(html);
  if (!root) {
    return null;
  }

  return root.inner
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * `vercel.json` has no catch-all rewrite, so Vercel falls back to 404.html for
 * unmatched paths and returns a real 404. If this file goes missing or loses
 * its noindex, the site silently reverts to answering every bogus URL with an
 * indexable 200 — which is what it did before, and is invisible from the
 * outside without checking status codes.
 */
async function checkNotFoundPage(distDir: string) {
  const outputPath = path.join(distDir, "404.html");
  const failures: string[] = [];

  let html: string;
  try {
    html = await readFile(outputPath, "utf8");
  } catch {
    return [
      `404.html: missing from ${distDir} — unmatched paths would fall back to a 200`,
    ];
  }

  if (!/<meta name="robots" content="[^"]*noindex/i.test(html)) {
    failures.push(`404.html: expected a noindex robots meta tag`);
  }

  const text = extractRootText(html);
  if (text === null || text.length < MIN_404_TEXT_CHARS) {
    failures.push(
      `404.html: only ${text?.length ?? 0} chars of prerendered body text ` +
        `(expected at least ${MIN_404_TEXT_CHARS})`
    );
  }

  return failures;
}

async function main() {
  const distDir = path.resolve("dist", "public");
  const entries = getAllRenderablePageMetadata();
  const failures: string[] = [];
  const textByRoute = new Map<string, string>();

  for (const entry of entries) {
    const outputPath = getRouteOutputPath(distDir, entry.path);

    let html: string;
    try {
      html = await readFile(outputPath, "utf8");
    } catch {
      failures.push(`${entry.path}: expected generated file at ${outputPath}`);
      continue;
    }

    const text = extractRootText(html);
    if (text === null) {
      failures.push(
        `${entry.path}: no balanced <div id="root"> in ${outputPath}`
      );
      continue;
    }

    if (text.length < MIN_BODY_TEXT_CHARS) {
      failures.push(
        `${entry.path}: only ${text.length} chars of prerendered body text ` +
          `(expected at least ${MIN_BODY_TEXT_CHARS}) — the React render did not land in #root`
      );
      continue;
    }

    // Compare in escaped form using the generator's own escapeHtml, so there is
    // no second entity decoder here that could drift out of sync with it.
    const expectedTitle = escapeHtml(
      resolvePageMetadata(entry.metadata).fullTitle
    );
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title\s*>/i);
    const actualTitle = titleMatch ? titleMatch[1] : "";
    if (actualTitle !== expectedTitle) {
      failures.push(
        `${entry.path}: title is ${JSON.stringify(actualTitle)}, expected ${JSON.stringify(expectedTitle)}`
      );
      continue;
    }

    textByRoute.set(entry.path, text);
  }

  // Identical bodies across routes means wouter fell back to "/" and every
  // page rendered Home.
  const seen = new Map<string, string>();
  for (const [routePath, text] of textByRoute) {
    const fingerprint = text.slice(0, 2000);
    const duplicate = seen.get(fingerprint);
    if (duplicate) {
      failures.push(
        `${routePath}: prerendered body is identical to ${duplicate} — ` +
          `check that entry-server.tsx wraps <App /> in <Router ssrPath>`
      );
    } else {
      seen.set(fingerprint, routePath);
    }
  }

  failures.push(...(await checkNotFoundPage(distDir)));

  if (failures.length > 0) {
    console.error(
      `Prerender verification failed (${failures.length} problems):`
    );
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exit(1);
  }

  const smallest = [...textByRoute.entries()].sort(
    (a, b) => a[1].length - b[1].length
  )[0];
  console.log(
    `Verified ${entries.length} prerendered routes ` +
      `(smallest body: ${smallest[1].length} chars at ${smallest[0]})`
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
