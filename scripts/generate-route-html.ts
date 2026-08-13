import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { render } from "../dist/server/entry-server.js";
import {
  getAllRenderablePageMetadata,
  resolvePageMetadata,
} from "../client/src/lib/pageMetadata";
import { siteConfig } from "../client/src/lib/site";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsonForScript(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function stripManagedSeoTags(html: string) {
  let previous: string;
  do {
    previous = html;
    html = html
      .replace(/<meta\s+name="description"[^>]*>\s*/gi, "")
      .replace(/<meta\s+name="robots"[^>]*>\s*/gi, "")
      .replace(/<meta\s+property="og:title"[^>]*>\s*/gi, "")
      .replace(/<meta\s+property="og:description"[^>]*>\s*/gi, "")
      .replace(/<meta\s+property="og:type"[^>]*>\s*/gi, "")
      .replace(/<meta\s+property="og:url"[^>]*>\s*/gi, "")
      .replace(/<meta\s+property="og:image"[^>]*>\s*/gi, "")
      .replace(/<meta\s+property="og:site_name"[^>]*>\s*/gi, "")
      .replace(/<meta\s+name="twitter:card"[^>]*>\s*/gi, "")
      .replace(/<meta\s+name="twitter:title"[^>]*>\s*/gi, "")
      .replace(/<meta\s+name="twitter:description"[^>]*>\s*/gi, "")
      .replace(/<meta\s+name="twitter:image"[^>]*>\s*/gi, "")
      .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
      .replace(/<script\s+id="structured-data"[^>]*>[\s\S]*?<\/script>\s*/gi, ""); // codeql[js/incomplete-multi-character-sanitization] - input is trusted build output, not user-supplied
  } while (html !== previous);
  return html;
}

function buildSeoMarkup(routePath: string) {
  const resolved = resolvePageMetadata(
    getAllRenderablePageMetadata().find((entry) => entry.path === routePath)?.metadata ?? {
      path: routePath,
    }
  );

  const tags = [
    `<meta name="description" content="${escapeHtml(resolved.description)}" />`,
    `<meta name="robots" content="${escapeHtml(resolved.robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(resolved.fullTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(resolved.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(resolved.type)}" />`,
    `<meta property="og:url" content="${escapeHtml(resolved.url)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteConfig.name)}" />`,
    `<meta name="twitter:card" content="${resolved.image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escapeHtml(resolved.fullTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(resolved.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(resolved.url)}" />`,
  ];

  if (resolved.image) {
    const fullImageUrl = resolved.image.startsWith("http")
      ? resolved.image
      : new URL(resolved.image, siteConfig.url).toString();

    tags.push(`<meta property="og:image" content="${escapeHtml(fullImageUrl)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(fullImageUrl)}" />`);
  }

  if (resolved.structuredData) {
    tags.push(
      `<script id="structured-data" type="application/ld+json">${escapeJsonForScript(
        resolved.structuredData
      )}</script>`
    );
  }

  return {
    resolved,
    seoMarkup: tags.map((tag) => `    ${tag}`).join("\n"),
  };
}

function injectMetadataIntoHtml(baseHtml: string, routePath: string) {
  const { resolved, seoMarkup } = buildSeoMarkup(routePath);

  const withTitle = baseHtml.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(resolved.fullTitle)}</title>`
  );

  const cleaned = stripManagedSeoTags(withTitle);
  const withHead = cleaned.replace("</head>", `${seoMarkup}\n  </head>`);

  return injectRenderedBody(withHead, routePath);
}

const EMPTY_ROOT = '<div id="root"></div>';
const ROOT_OPEN = '<div id="root">';
const ROOT_CLOSE = "</div>";

/**
 * The base template is read from `dist/public/index.html`, which this script
 * also overwrites for "/". Emptying the root div keeps a re-run idempotent
 * instead of failing on already-prerendered markup.
 */
function emptyRootDiv(html: string) {
  const start = html.indexOf(ROOT_OPEN);
  if (start === -1) {
    throw new Error(
      `Could not find ${ROOT_OPEN} in the built HTML. ` +
        `The Vite template in client/index.html must contain a root div.`
    );
  }

  // Walk to the matching close tag. React escapes text content, so a literal
  // "<div" in prose can never appear here — only real tags.
  let depth = 0;
  let cursor = start;
  while (cursor < html.length) {
    const open = html.indexOf("<div", cursor);
    const close = html.indexOf(ROOT_CLOSE, cursor);

    if (close === -1) {
      break;
    }

    if (open !== -1 && open < close) {
      depth += 1;
      cursor = open + 4;
      continue;
    }

    depth -= 1;
    cursor = close + ROOT_CLOSE.length;
    if (depth === 0) {
      return html.slice(0, start) + EMPTY_ROOT + html.slice(cursor);
    }
  }

  throw new Error(`Unbalanced ${ROOT_OPEN} in the built HTML.`);
}

function injectRenderedBody(html: string, routePath: string) {
  if (!html.includes(EMPTY_ROOT)) {
    throw new Error(
      `Could not find ${EMPTY_ROOT} in the built HTML while prerendering ${routePath}.`
    );
  }

  return html.replace(EMPTY_ROOT, `<div id="root">${render(routePath)}</div>`);
}

function getRouteOutputPath(distDir: string, routePath: string) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, routePath.slice(1), "index.html");
}

async function main() {
  const distDir = path.resolve("dist", "public");
  const baseHtmlPath = path.join(distDir, "index.html");
  const baseHtml = emptyRootDiv(await readFile(baseHtmlPath, "utf8"));

  const routeEntries = getAllRenderablePageMetadata();

  for (const entry of routeEntries) {
    const outputPath = getRouteOutputPath(distDir, entry.path);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, injectMetadataIntoHtml(baseHtml, entry.path), "utf8");
  }

  console.log(`Generated ${routeEntries.length} route-specific HTML files in ${distDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
