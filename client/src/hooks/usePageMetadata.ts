import { useEffect } from "react";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { type PageMetadata, resolvePageMetadata } from "@/lib/pageMetadata";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export function usePageMetadata({
  title,
  description,
  path,
  type,
  image,
  robots,
  structuredData,
}: PageMetadata) {
  useEffect(() => {
    const resolved = resolvePageMetadata({
      title,
      description,
      path,
      type,
      image,
      robots,
      structuredData,
    });
    const url = absoluteUrl(resolved.path);

    document.title = resolved.fullTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: resolved.description,
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: resolved.robots,
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: resolved.fullTitle,
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: resolved.description,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: resolved.type,
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: url,
    });

    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: siteConfig.name,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: resolved.image ? "summary_large_image" : "summary",
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: resolved.fullTitle,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: resolved.description,
    });

    if (resolved.image) {
      const fullImageUrl = resolved.image.startsWith("http")
        ? resolved.image
        : absoluteUrl(resolved.image);

      upsertMeta('meta[property="og:image"]', {
        property: "og:image",
        content: fullImageUrl,
      });

      upsertMeta('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: fullImageUrl,
      });
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }

    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: url,
    });

    const scriptId = "structured-data";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (resolved.structuredData) {
      const script = existingScript ?? document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(resolved.structuredData);

      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [description, image, path, robots, structuredData, title, type]);
}
