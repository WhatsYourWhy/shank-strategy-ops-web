import { writeFile } from "node:fs/promises";
import path from "node:path";
import { blogPosts } from "../client/src/data/blogPosts";
import { staticRenderablePaths } from "../client/src/lib/pageMetadata";
import { siteConfig } from "../client/src/lib/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  const buildDate = new Date().toISOString().slice(0, 10);

  const urls = [
    ...staticRenderablePaths.map((route) => ({
      loc: new URL(route, siteConfig.url).toString(),
      lastmod: buildDate,
    })),
    ...[...blogPosts]
      .sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      )
      .map((post) => ({
        loc: new URL(`/blog/${post.slug}`, siteConfig.url).toString(),
        lastmod: post.publishedDate,
      })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (url) =>
        `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n  </url>`
    ),
    "</urlset>",
    "",
  ].join("\n");

  const outputPath = path.resolve("client/public/sitemap.xml");
  await writeFile(outputPath, xml, "utf8");
  console.log(`Generated sitemap with ${urls.length} URLs at ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
