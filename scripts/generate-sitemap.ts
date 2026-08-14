import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { blogPosts } from "../client/src/data/blogPosts";
import {
  staticRenderablePaths,
  type StaticRenderablePath,
} from "../client/src/lib/pageMetadata";
import { siteConfig } from "../client/src/lib/site";

/**
 * `lastmod` is a change signal, and it is only worth anything if it changes
 * when the page does.
 *
 * This used to stamp every static page with `new Date()`, so all nine rewrote
 * on every build whether or not a word had moved. A crawler seeing nine pages
 * "modified" daily learns to ignore the field — and it also meant the sitemap
 * showed up modified in `git status` after every build.
 *
 * Each static route now reports the date of the last commit that touched the
 * source behind it. Blog posts keep their `publishedDate`: every post lives in
 * the same data module, so a git date would move all twelve whenever any one
 * of them was edited, which is the same uselessness in a different shape.
 */

/**
 * Source files that decide what a route renders.
 *
 * Deliberately just the page component (plus the post data for the blog
 * index), not the shared layout or `pageMetadata.ts` — including those would
 * bump all nine dates together on any shared-component edit and put us back
 * where we started.
 *
 * Typed against `StaticRenderablePath`, so adding a route to
 * `staticRenderablePaths` without adding it here fails `pnpm check`.
 */
const ROUTE_SOURCES: Record<StaticRenderablePath, string[]> = {
  "/": ["client/src/pages/Home.tsx"],
  "/about": ["client/src/pages/About.tsx"],
  "/methodology": ["client/src/pages/Methodology.tsx"],
  "/editorial-policy": ["client/src/pages/EditorialPolicy.tsx"],
  "/privacy": ["client/src/pages/Privacy.tsx"],
  "/terms": ["client/src/pages/Terms.tsx"],
  "/blog": ["client/src/pages/Blog.tsx", "client/src/data/blogPosts.ts"],
  "/tools": ["client/src/pages/Products.tsx"],
  "/operator-audit": ["client/src/pages/OperatorAudit.tsx"],
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Whether git history is deep enough to date individual files.
 *
 * This gate is the whole reason the script is not simply "ask git". Vercel and
 * actions/checkout both clone at depth 1, and in a depth-1 clone `git log -1 --
 * <path>` does not fail and does not return nothing: it returns the single
 * commit present, for *every* path. So each page appears to have been modified
 * by the current deploy, all nine dates collapse onto the deploy date, and the
 * daily churn this script exists to remove comes straight back — with the
 * fallback never firing, because git answered.
 *
 * Verified in production: the first version of this script shipped every page
 * as 2026-08-13, the deploy commit's date in its committer timezone.
 *
 * A shallow clone therefore has to be detected up front and git ignored
 * entirely, rather than trusted and second-guessed per route.
 */
function hasDatableHistory() {
  try {
    const output = execFileSync(
      "git",
      ["rev-parse", "--is-shallow-repository"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();

    return output === "false";
  } catch {
    return false;
  }
}

/**
 * Date of the last commit touching any of `files`, as YYYY-MM-DD.
 *
 * Returns null rather than throwing when git can't answer. Only meaningful
 * when `hasDatableHistory()` is true — see the note there.
 */
function gitLastModified(files: string[]): string | null {
  try {
    const output = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", ...files],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();

    return /^\d{4}-\d{2}-\d{2}$/.test(output) ? output : null;
  } catch {
    return null;
  }
}

/**
 * `lastmod` values from the sitemap already in the repo, keyed by the `<loc>`
 * exactly as written there.
 *
 * This is what makes a shallow clone harmless. On Vercel the dates are not
 * recomputed at all — they are carried over from the file in the repo, which a
 * local build wrote with full history. The URL list is still rebuilt from the
 * route table and post data, so a new page or post added without a local build
 * still reaches the deployed sitemap; only its date falls back.
 */
async function readCommittedLastmod(outputPath: string) {
  const committed = new Map<string, string>();

  let xml: string;
  try {
    xml = await readFile(outputPath, "utf8");
  } catch {
    return committed;
  }

  const entry = /<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
  for (const match of xml.matchAll(entry)) {
    committed.set(match[1], match[2]);
  }

  return committed;
}

async function main() {
  const outputPath = path.resolve("client/public/sitemap.xml");
  const committed = await readCommittedLastmod(outputPath);
  const buildDate = new Date().toISOString().slice(0, 10);
  const datable = hasDatableHistory();
  const undated: string[] = [];

  const urls = [
    ...staticRenderablePaths.map(route => {
      const loc = new URL(route, siteConfig.url).toString();
      const fromGit = datable ? gitLastModified(ROUTE_SOURCES[route]) : null;

      if (!fromGit && !committed.has(escapeXml(loc))) {
        undated.push(route);
      }

      return {
        loc,
        lastmod: fromGit ?? committed.get(escapeXml(loc)) ?? buildDate,
      };
    }),
    ...[...blogPosts]
      .sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime()
      )
      .map(post => ({
        loc: new URL(`/blog/${post.slug}`, siteConfig.url).toString(),
        lastmod: post.publishedDate,
      })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      url =>
        `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n  </url>`
    ),
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(outputPath, xml, "utf8");

  if (undated.length > 0) {
    console.warn(
      `  warning: no git history or committed lastmod for ${undated.join(", ")} — ` +
        `stamped with the build date`
    );
  }

  console.log(
    `Generated sitemap with ${urls.length} URLs at ${outputPath} ` +
      `(lastmod from ${datable ? "git history" : "the committed sitemap — shallow clone"})`
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
