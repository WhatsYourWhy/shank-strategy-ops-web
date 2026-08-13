import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  getAllRenderablePageMetadata,
  resolvePageMetadata,
} from "../client/src/lib/pageMetadata";
import { escapeHtml } from "./html";

/**
 * Build gate for the prerender step.
 *
 * The repo has no CI and no test suite, and a prerender that silently
 * regressed to an empty <div id="root"></div> would look exactly like a
 * healthy build. This runs inside `pnpm build` (and therefore inside the
 * Vercel build) and fails it if any route stops shipping real body HTML.
 *
 * It also catches the two failure modes that would otherwise pass a naive
 * "is the body non-empty" check:
 *   - a missing wouter `ssrPath`, which renders Home into every route
 *   - a change to vercel.json / the output layout that collapses every route
 *     back to the generic shell
 */

const MIN_BODY_TEXT_CHARS = 500;

function getRouteOutputPath(distDir: string, routePath: string) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, routePath.slice(1), "index.html");
}

/** Plain text inside #root, with scripts and markup removed. */
function extractRootText(html: string) {
  const start = html.indexOf('<div id="root">');
  if (start === -1) {
    return null;
  }

  const body = html.slice(start);
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
      failures.push(`${entry.path}: no <div id="root"> in ${outputPath}`);
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
