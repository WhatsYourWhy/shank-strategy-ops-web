import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { chromium, type ConsoleMessage, type Page } from "playwright";
import {
  getAllRenderablePageMetadata,
  notFoundPath,
} from "../client/src/lib/pageMetadata";

/**
 * Runtime gate for the prerender step.
 *
 * `verify-prerender.ts` proves the build *emitted* correct HTML. It cannot
 * prove a browser can *use* it. Those are different failures: if the server
 * markup and the client's first render disagree, React throws the server HTML
 * away and re-renders from scratch. The page still looks right, `pnpm build`
 * still passes, `tsc` still passes — and the prerendering silently stopped
 * doing anything, because every visitor now waits for the JS bundle anyway.
 *
 * That is exactly the failure mode the framer-motion 13 bump could have
 * shipped: green build, no signal either way. This script supplies the signal.
 *
 * For each route it asserts three things:
 *   1. No uncaught exception and no React hydration error in the console.
 *   2. React actually attached to #root — catches a bundle that never ran,
 *      which produces a silent, error-free, completely static page.
 *   3. Exactly one <main id="main-content"> survives hydration, which is the
 *      invariant generate-llms.ts and extractMainHtml() both depend on.
 *
 * It serves `dist/public` the way Vercel does rather than using `pnpm start`,
 * which returns the root index.html for every path and would therefore test
 * the un-prerendered shell 21 times.
 */

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

/**
 * React 19 ships minified errors in production, so the readable
 * "Hydration failed because..." text is not what a built bundle logs. The
 * numeric codes are the ones that actually appear:
 *   418 - hydration text content mismatch
 *   423 - error while hydrating, recovered by client re-render
 *   425 - text content does not match server-rendered HTML
 * The prose patterns are kept so this also works against a dev build.
 */
const HYDRATION_ERROR_PATTERNS = [
  /Minified React error #(418|423|425)\b/,
  /react\.dev\/errors\/(418|423|425)\b/,
  /Hydration failed because/i,
  /text content does not match/i,
  /did not match the server-rendered HTML/i,
  /server rendered HTML didn't match/i,
];

/**
 * Same-origin requests the local static server cannot satisfy but production
 * can. The Vercel Analytics script is injected by <Analytics /> and served by
 * Vercel's edge rather than from dist/public, so a failed load here is expected
 * and says nothing about hydration.
 */
const EXPECTED_MISSING = [/\/_vercel\/insights\//];

const RESOURCE_ERROR = /^Failed to load resource/;

/**
 * Third-party subresources — ad scripts, fonts, the analytics beacon — cannot
 * load against a local static server, and in CI there may be no outbound DNS at
 * all. Their failures are unrelated to whether our own markup hydrated, so they
 * are dropped rather than reported. Same-origin failures are kept: those mean a
 * real asset is missing from the build.
 */
function isIgnorableResourceError(text: string, url: string, origin: string) {
  if (!RESOURCE_ERROR.test(text)) {
    return false;
  }

  return !url.startsWith(origin) || EXPECTED_MISSING.some(p => p.test(url));
}

function contentTypeFor(filePath: string) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

async function resolveFile(distDir: string, urlPath: string) {
  // Resolve inside distDir so a traversal in the request can't escape it.
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = path.resolve(distDir, `.${path.posix.normalize(decoded)}`);
  if (candidate !== distDir && !candidate.startsWith(distDir + path.sep)) {
    return null;
  }

  for (const attempt of [candidate, path.join(candidate, "index.html")]) {
    try {
      if ((await stat(attempt)).isFile()) {
        return attempt;
      }
    } catch {
      // Fall through to the next candidate, then to 404.html.
    }
  }

  return null;
}

/** Mirrors Vercel with no catch-all rewrite: real files, else a real 404. */
async function startServer(distDir: string) {
  const server = createServer((req, res) => {
    void (async () => {
      const filePath = await resolveFile(distDir, req.url ?? "/");
      if (filePath) {
        res.writeHead(200, { "content-type": contentTypeFor(filePath) });
        createReadStream(filePath).pipe(res);
        return;
      }

      const notFoundFile = path.join(distDir, "404.html");
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      createReadStream(notFoundFile).pipe(res);
    })();
  });

  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;

  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>(resolve => server.close(() => resolve())),
  };
}

interface RouteResult {
  failures: string[];
  warnings: string[];
}

async function checkRoute(
  page: Page,
  origin: string,
  routePath: string
): Promise<RouteResult> {
  const failures: string[] = [];
  const warnings: string[] = [];

  const documentUrl = `${origin}${routePath}`;
  const expectedStatus = routePath === notFoundPath ? 404 : 200;

  const onConsole = (message: ConsoleMessage) => {
    if (message.type() !== "error") {
      return;
    }

    const text = message.text();
    if (HYDRATION_ERROR_PATTERNS.some(pattern => pattern.test(text))) {
      failures.push(`hydration error: ${text}`);
      return;
    }

    const url = message.location()?.url ?? "";

    // The 404 route is supposed to answer 404, so the browser logging its own
    // document load as a failed resource is the assertion passing, not a fault.
    if (expectedStatus === 404 && url === documentUrl) {
      return;
    }

    if (isIgnorableResourceError(text, url, origin)) {
      return;
    }

    warnings.push(url ? `${text} (${url})` : text);
  };

  // React 19 rethrows a hydration mismatch as an uncaught exception rather than
  // only logging it, so this handler — not the console one — is what usually
  // catches a real mismatch. Both paths are kept: dev builds log instead.
  const onPageError = (error: Error) => {
    const isHydration = HYDRATION_ERROR_PATTERNS.some(pattern =>
      pattern.test(error.message)
    );
    failures.push(
      `${isHydration ? "hydration error" : "uncaught exception"}: ${error.message}`
    );
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  try {
    const response = await page.goto(`${origin}${routePath}`, {
      waitUntil: "load",
    });

    const status = response?.status();
    if (status !== expectedStatus) {
      failures.push(`expected HTTP ${expectedStatus}, got ${status}`);
    }

    // React sets __reactContainer$<hash> on the container once it takes
    // ownership. Absent after load means the bundle never hydrated.
    try {
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          return (
            !!root &&
            Object.keys(root).some(key => key.startsWith("__reactContainer$"))
          );
        },
        undefined,
        { timeout: 10_000 }
      );
    } catch {
      failures.push(
        "React never attached to #root — the page is inert static HTML"
      );
    }

    const mainCount = await page.locator("main#main-content").count();
    if (mainCount !== 1) {
      failures.push(
        `expected exactly one <main id="main-content"> after hydration, found ${mainCount}`
      );
    }
  } catch (error) {
    failures.push(`navigation failed: ${(error as Error).message}`);
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }

  return { failures, warnings };
}

async function main() {
  const distDir = path.resolve("dist", "public");
  const routes = [
    ...getAllRenderablePageMetadata().map(entry => entry.path),
    notFoundPath,
  ];

  const server = await startServer(distDir);
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const failuresByRoute = new Map<string, string[]>();
  const warningsByRoute = new Map<string, string[]>();

  try {
    for (const routePath of routes) {
      const page = await context.newPage();
      try {
        const { failures, warnings } = await checkRoute(
          page,
          server.origin,
          routePath
        );
        if (failures.length > 0) {
          failuresByRoute.set(routePath, failures);
        }
        if (warnings.length > 0) {
          warningsByRoute.set(routePath, warnings);
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
    await browser.close();
    await server.close();
  }

  for (const [routePath, warnings] of warningsByRoute) {
    for (const warning of warnings) {
      console.warn(`  warning ${routePath}: ${warning}`);
    }
  }

  if (failuresByRoute.size > 0) {
    const total = [...failuresByRoute.values()].flat().length;
    console.error(
      `Hydration check failed (${total} problems across ${failuresByRoute.size} routes):`
    );
    for (const [routePath, failures] of failuresByRoute) {
      for (const failure of failures) {
        console.error(`  - ${routePath}: ${failure}`);
      }
    }
    process.exit(1);
  }

  console.log(`Hydrated ${routes.length} routes with no hydration errors`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
