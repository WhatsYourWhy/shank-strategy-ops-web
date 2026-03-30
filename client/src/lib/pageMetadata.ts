import { blogPosts, type BlogPost } from "../data/blogPosts";
import { absoluteUrl, siteConfig } from "./site";

export type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

export interface PageMetadata {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  robots?: string;
  structuredData?: StructuredData;
}

export interface ResolvedPageMetadata extends PageMetadata {
  description: string;
  fullTitle: string;
  path: string;
  robots: string;
  type: "website" | "article";
  url: string;
}

export const staticRenderablePaths = [
  "/",
  "/about",
  "/methodology",
  "/editorial-policy",
  "/privacy",
  "/terms",
  "/blog",
  "/tools",
] as const;

export type StaticRenderablePath = (typeof staticRenderablePaths)[number];

export function resolvePageMetadata(metadata: PageMetadata): ResolvedPageMetadata {
  const description = metadata.description ?? siteConfig.defaultDescription;
  const path = metadata.path ?? "/";
  const type = metadata.type ?? "website";
  const robots = metadata.robots ?? "index,follow";
  const fullTitle = metadata.title
    ? `${metadata.title} | ${siteConfig.name}`
    : siteConfig.defaultTitle;

  return {
    ...metadata,
    description,
    fullTitle,
    path,
    robots,
    type,
    url: absoluteUrl(path),
  };
}

export function getStaticPageMetadata(path: StaticRenderablePath): PageMetadata {
  switch (path) {
    case "/":
      return {
        path: "/",
        title: "Strategic Operations Consulting, Operator Notes, and Tools",
        description:
          "Shank Strategy Ops provides strategic operations consulting for leaders fixing execution drift, decision bottlenecks, and operating cadences that no longer hold under real conditions.",
        structuredData: [
          {
            "@context": "https://schema.org",
            ...siteConfig.publisher,
          },
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: siteConfig.name,
            url: absoluteUrl("/"),
            email: siteConfig.email,
            description:
              "Strategic operations consulting and operational repair for leaders who need clearer control, stronger operating cadences, and durable systems.",
            areaServed: "United States",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: absoluteUrl("/"),
          },
        ],
      };
    case "/about":
      return {
        title: "Strategic Operations Consulting Practice",
        path: "/about",
        description:
          "Learn how Shank Strategy Ops combines strategic operations consulting, operator notes, and working tools to help leaders repair execution drift.",
        structuredData: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Shank Strategy Ops",
          url: absoluteUrl("/about"),
          description:
            "About page for Shank Strategy Ops covering consulting focus, editorial approach, and intended audience.",
          isPartOf: absoluteUrl("/"),
        },
      };
    case "/methodology":
      return {
        title: "Content Methodology and Review Standards",
        path: "/methodology",
        description:
          "See how Shank Strategy Ops researches, reviews, updates, and quality-checks essays and tool writeups before publication.",
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Methodology",
          url: absoluteUrl("/methodology"),
          description:
            "Methodology page describing sourcing, testing, review, and update standards for Shank Strategy Ops.",
        },
      };
    case "/editorial-policy":
      return {
        title: "Editorial Standards and Corrections",
        path: "/editorial-policy",
        description:
          "Review the editorial standards Shank Strategy Ops uses for originality, disclosures, corrections, authorship, and publishing quality.",
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Editorial Policy",
          url: absoluteUrl("/editorial-policy"),
          description:
            "Editorial policy for Shank Strategy Ops covering originality, disclosures, and correction practices.",
        },
      };
    case "/privacy":
      return {
        title: "Privacy Policy for Contact and Site Data",
        path: "/privacy",
        description:
          "Understand how Shank Strategy Ops handles contact form submissions, bot protection, hosting logs, and advertising-related disclosures.",
        structuredData: {
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          name: "Privacy Policy",
          url: absoluteUrl("/privacy"),
          description:
            "Privacy policy for Shank Strategy Ops covering contact form data, bot protection, hosting logs, and advertising disclosures.",
        },
      };
    case "/terms":
      return {
        title: "Website Terms of Use",
        path: "/terms",
        description:
          "Read the Shank Strategy Ops terms covering website use, intellectual property, informational content, and external links.",
        structuredData: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Terms of Use",
          url: absoluteUrl("/terms"),
          description: "Terms of use for the Shank Strategy Ops website.",
        },
      };
    case "/blog":
      return {
        title: "Operator Notes and Essays",
        path: "/blog",
        description:
          "Operator notes, essays, and field reports from Shank Strategy Ops on strategy execution, operations, deterministic systems, and working tools.",
        structuredData: [
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Shank Strategy Ops Blog",
            url: absoluteUrl("/blog"),
            description:
              "Original essays and field notes on strategy, operations, deterministic systems, and tools.",
            publisher: siteConfig.publisher,
          },
          {
            "@context": "https://schema.org",
            ...siteConfig.publisher,
          },
        ],
      };
    case "/tools":
      return {
        title: "Operational Tools and Systems",
        path: "/tools",
        description:
          "Operational tools from Shank Strategy Ops for supply chain risk, anomaly detection, document intelligence, compute scheduling, and safety-minded control layers.",
        structuredData: [
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Shank Strategy Ops Tools",
            url: absoluteUrl("/tools"),
            description:
              "Production-shaped tools from Shank Strategy Ops for operations and engineering teams.",
            publisher: siteConfig.publisher,
          },
          {
            "@context": "https://schema.org",
            ...siteConfig.publisher,
          },
        ],
      };
  }
}

export function getBlogPostMetadata(
  post?: BlogPost,
  slug?: string
): PageMetadata {
  if (!post) {
    return {
      title: "Article",
      path: slug ? `/blog/${slug}` : "/blog",
      description: "Article from Shank Strategy Ops.",
      type: "article",
      robots: "noindex,follow",
    };
  }

  return {
    title: post.title,
    path: `/blog/${post.slug}`,
    description: post.tldr,
    type: "article",
    image: post.heroImage,
    robots: "index,follow",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      alternativeHeadline: post.subtitle,
      description: post.tldr,
      image: post.heroImage ? absoluteUrl(post.heroImage) : undefined,
      datePublished: post.publishedDate,
      dateModified: post.publishedDate,
      author: {
        "@type": "Organization",
        name: post.author,
      },
      publisher: siteConfig.publisher,
      keywords: post.tags.join(", "),
      articleSection: post.tags[0],
      inLanguage: "en-US",
      isAccessibleForFree: true,
      mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    },
  };
}

export function getAllRenderablePageMetadata() {
  return [
    ...staticRenderablePaths.map((path) => ({
      path,
      metadata: getStaticPageMetadata(path),
    })),
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      metadata: getBlogPostMetadata(post),
    })),
  ];
}
