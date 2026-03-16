import { useEffect } from "react";
import { absoluteUrl, siteConfig } from "@/lib/site";

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

interface PageMetadata {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  robots?: string;
  structuredData?: StructuredData;
}

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
  description = siteConfig.defaultDescription,
  path = "/",
  type = "website",
  image,
  robots = "index,follow",
  structuredData,
}: PageMetadata) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
    const url = absoluteUrl(path);

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: url,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: image ? "summary_large_image" : "summary",
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });

    if (image) {
      const fullImageUrl = image.startsWith("http") ? image : absoluteUrl(image);

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

    if (structuredData) {
      const script = existingScript ?? document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);

      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [description, image, path, robots, structuredData, title, type]);
}
