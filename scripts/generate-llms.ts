import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { blogPosts } from "../client/src/data/blogPosts";
import {
  getAllRenderablePageMetadata,
  resolvePageMetadata,
  staticRenderablePaths,
} from "../client/src/lib/pageMetadata";
import { absoluteUrl, siteConfig } from "../client/src/lib/site";
import { extractMainHtml, htmlToText } from "./html";

/**
 * Generates the AI-retrieval surface:
 *
 *   llms-full.txt  the full text of every page in one fetch
 *   llms.txt       a "Writing" index of every essay, refreshed in place
 *
 * Content comes from the prerendered HTML in dist/public rather than from the
 * data modules, because most page copy (About, Methodology, Operator Audit) is
 * literal JSX with no data module behind it. Reading what actually shipped also
 * means this file cannot drift from the site.
 *
 * That is why this runs after generate-route-html rather than alongside
 * generate-sitemap: it needs the rendered output to exist. Since `vite build`
 * has already copied client/public into dist/public by then, each file is
 * written to client/public (the committed source of truth, as with sitemap.xml)
 * and then copied into dist/public so it ships in this same build.
 */

/**
 * The managed block is delimited by its own heading and the next top-level
 * heading, not by comment markers. llms.txt is served as text/plain, so nothing
 * renders an HTML comment away — a marker would be visible to every AI that
 * reads the file, in a file whose whole job is to read cleanly.
 */
const WRITING_HEADING = "## Writing";
const CONTACT_HEADING = "## Contact";

/**
 * Pages left out of the body dump. They stay listed in llms.txt and served at
 * their own URLs.
 *
 * - /privacy, /terms: boilerplate that would dilute the substantive text
 * - /blog: a pure index whose every card is already covered twice over, by the
 *   Writing section of llms.txt and by each post's own section below
 */
const EXCLUDED_FROM_FULL = new Set(["/privacy", "/terms", "/blog"]);

/** Page titles sit at `##`, so in-page headings start at `###`. */
const HEADING_OFFSET = 2;

/** Nav and footer live outside <main>, so a page contributing less than this
 *  means the extraction broke rather than the page being short. */
const MIN_PAGE_TEXT_CHARS = 400;

function pageTitle(routePath: string) {
  const entry = getAllRenderablePageMetadata().find(
    item => item.path === routePath
  );
  const resolved = resolvePageMetadata(entry?.metadata ?? { path: routePath });
  // Drop the " | Shank Strategy Ops" suffix — the file already says whose it is.
  return resolved.title ?? resolved.fullTitle.split(" | ")[0];
}

function getRouteOutputPath(distDir: string, routePath: string) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, routePath.slice(1), "index.html");
}

const postsNewestFirst = [...blogPosts].sort(
  (a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
);

async function readPageText(distDir: string, routePath: string) {
  const html = await readFile(getRouteOutputPath(distDir, routePath), "utf8");
  const main = extractMainHtml(html);

  if (main === null) {
    throw new Error(
      `No <main> element in the prerendered HTML for ${routePath}. ` +
        `generate-llms extracts page content from <main>; every page must render one.`
    );
  }

  const text = htmlToText(main, HEADING_OFFSET);

  if (text.length < MIN_PAGE_TEXT_CHARS) {
    throw new Error(
      `Only ${text.length} chars of text inside <main> for ${routePath} ` +
        `(expected at least ${MIN_PAGE_TEXT_CHARS}). Refusing to publish a hollow llms-full.txt.`
    );
  }

  return text;
}

async function buildLlmsFull(distDir: string) {
  const routes = [
    ...staticRenderablePaths.filter(route => !EXCLUDED_FROM_FULL.has(route)),
    ...postsNewestFirst.map(post => `/blog/${post.slug}`),
  ];

  const sections: string[] = [];

  for (const route of routes) {
    const text = await readPageText(distDir, route);
    sections.push(
      [
        `## ${pageTitle(route)}`,
        ``,
        `URL: ${absoluteUrl(route)}`,
        ``,
        text,
      ].join("\n")
    );
  }

  return [
    `# ${siteConfig.name} — full site text`,
    ``,
    `> ${siteConfig.defaultDescription}`,
    ``,
    `The complete text of every substantive page on ${siteConfig.url}, in one file.`,
    `Generated at build time from the site's own rendered output, so it cannot`,
    `drift from what the pages say. Policy pages (privacy, terms) are omitted;`,
    `they are listed in llms.txt and served at their own URLs.`,
    ``,
    `Contact: ${siteConfig.email}`,
    ``,
    sections.join("\n\n---\n\n"),
    ``,
  ].join("\n");
}

function buildWritingSection() {
  const lines = [
    WRITING_HEADING,
    ``,
    `Full text of every page in a single file: ${siteConfig.url}/llms-full.txt`,
    ``,
    `${postsNewestFirst.length} essays, newest first:`,
    ``,
    ...postsNewestFirst.map(
      post =>
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}) — ${post.publishedDate}: ${post.tldr}`
    ),
  ];

  return `${lines.join("\n")}\n`;
}

/** Start index of a top-level heading, or -1. Anchored to a line start so a
 *  mention of the heading text mid-paragraph can't match. */
function findHeading(llms: string, heading: string) {
  if (llms.startsWith(heading)) {
    return 0;
  }

  const index = llms.indexOf(`\n${heading}`);
  return index === -1 ? -1 : index + 1;
}

/**
 * Rewrites the Writing section in place, replacing everything from its heading
 * up to the next top-level heading. Everything else in llms.txt is hand-written
 * and is left exactly as-is.
 */
function applyWritingSection(llms: string, section: string) {
  const existing = findHeading(llms, WRITING_HEADING);

  if (existing !== -1) {
    const rest = llms.slice(existing + WRITING_HEADING.length);
    const nextHeading = rest.indexOf("\n## ");

    return nextHeading === -1
      ? llms.slice(0, existing) + section
      : llms.slice(0, existing) +
          section +
          "\n" +
          rest.slice(nextHeading + 1) +
          "";
  }

  // First run: insert ahead of Contact so it stays the last thing in the file.
  const contact = findHeading(llms, CONTACT_HEADING);
  if (contact === -1) {
    return `${llms.trimEnd()}\n\n${section}`;
  }

  return llms.slice(0, contact) + section + "\n" + llms.slice(contact);
}

async function main() {
  const distDir = path.resolve("dist", "public");
  const publicDir = path.resolve("client", "public");

  const llmsFullPath = path.join(publicDir, "llms-full.txt");
  const llmsFull = await buildLlmsFull(distDir);
  await writeFile(llmsFullPath, llmsFull, "utf8");

  const llmsPath = path.join(publicDir, "llms.txt");
  const llms = await readFile(llmsPath, "utf8");
  await writeFile(
    llmsPath,
    applyWritingSection(llms, buildWritingSection()),
    "utf8"
  );

  // vite build already copied client/public; refresh both files in the output.
  for (const name of ["llms-full.txt", "llms.txt"]) {
    await copyFile(path.join(publicDir, name), path.join(distDir, name));
  }

  console.log(
    `Generated llms-full.txt (${Math.round(llmsFull.length / 1024)} KB) and ` +
      `indexed ${postsNewestFirst.length} essays in llms.txt`
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
