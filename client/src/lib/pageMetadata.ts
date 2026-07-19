import { blogPosts, type BlogPost } from "../data/blogPosts";
import { absoluteUrl, siteConfig } from "./site";

export type StructuredData =
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

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
  "/operator-audit",
] as const;

export type StaticRenderablePath = (typeof staticRenderablePaths)[number];

export function resolvePageMetadata(
  metadata: PageMetadata
): ResolvedPageMetadata {
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

export function getStaticPageMetadata(
  path: StaticRenderablePath
): PageMetadata {
  switch (path) {
    case "/":
      return {
        path: "/",
        title: "Put AI to Work Inside the Business You Already Run",
        description:
          "AI-enabled operations implementation and strategic operations consulting. Start with the bounded $500 Operator Audit: find the workflow AI should carry, and fix the execution drift underneath.",
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
              "AI-enabled operations implementation and strategic operations consulting for owners and leadership teams — starting with a bounded $500 Operator Audit, scaling to workflow sprints, buildouts, and bounded advisory.",
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
    case "/operator-audit":
      return {
        title: "The $500 Operator Audit — an AI Workflow Reality Check",
        path: "/operator-audit",
        description:
          "A focused outside read on where your operation is losing clarity, time, and trust — and where AI can take real work off your plate. Written diagnosis and prioritized next moves within 5 business days.",
        structuredData: [
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Operator Audit",
            alternateName: "AI Workflow Reality Check",
            serviceType: "Operations and AI workflow diagnostic",
            provider: siteConfig.publisher,
            url: absoluteUrl("/operator-audit"),
            areaServed: "United States",
            description:
              "A focused diagnostic of how an operation is functioning, with a written audit identifying structural drag, where AI can carry real work, and prioritized next moves.",
            offers: {
              "@type": "Offer",
              price: "500",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: absoluteUrl("/operator-audit"),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What do you get for the $500 Operator Audit?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A close read of your current operating reality, a written diagnosis of the main sources of drag, ambiguity, or breakdown, a clear statement of the structural issues underneath the symptoms, a straight read on where AI can take real work off your plate first — and where it should not — and practical next-step recommendations.",
                },
              },
              {
                "@type": "Question",
                name: "How long does the Operator Audit take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Standard turnaround is within 5 business days of receiving the needed materials. If a faster turnaround is needed, that can be discussed before purchase.",
                },
              },
              {
                "@type": "Question",
                name: "Who is the Operator Audit for?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Owners, operators, and managers carrying too much coordination load; owners who know AI should be helping by now but can't point to one workflow where it actually is; teams functioning with more friction than they should have; and businesses where handoffs, follow-through, prioritization, or review quality are slipping.",
                },
              },
              {
                "@type": "Question",
                name: "How does the audit handle AI in my operation?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The audit reads AI the same way it reads any other part of the operation: where it is making the work clearer, and where it is making the work look clearer while the underlying problem keeps moving. It also names the single workflow where AI plus clear ownership would remove the most load.",
                },
              },
              {
                "@type": "Question",
                name: "What happens after the audit?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The audit is complete on its own. If you want help acting on it, the path is explicit: an AI Workflow Sprint, an AI Operations Buildout, or an AI Operator Retainer. Pricing for these is scoped from what the audit finds, and nothing past the audit is proposed unless the diagnosis earns it.",
                },
              },
            ],
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
              "The instruments Shank Strategy Ops uses in consulting engagements, described honestly by maturity and availability, including consulting-ready, paid-template, and open in-validation products.",
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
    ...staticRenderablePaths.map(path => ({
      path,
      metadata: getStaticPageMetadata(path),
    })),
    ...blogPosts.map(post => ({
      path: `/blog/${post.slug}`,
      metadata: getBlogPostMetadata(post),
    })),
  ];
}
