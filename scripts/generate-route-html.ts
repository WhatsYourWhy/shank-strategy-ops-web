import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
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
      .replace(/<script\s+id="structured-data"[\s\S]*?<\/script>\s*/gi, "");
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

  return cleaned.replace("</head>", `${seoMarkup}\n  </head>`);
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
  const baseHtml = await readFile(baseHtmlPath, "utf8");

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
