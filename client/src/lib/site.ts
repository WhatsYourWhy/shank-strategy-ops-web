const defaultDescription =
  "Strategic operations consulting and AI-enabled operations implementation for small business owners, founders, and leadership teams. Put AI to work inside the business you already run — starting with a bounded $500 diagnostic, not a transformation program.";

export const siteConfig = {
  name: "Shank Strategy Ops",
  legalName: "Shank Strategy Ops",
  url: "https://shankstrategy.com",
  email: "contact@shankstrategy.com",
  responseWindow: "within 48 hours",
  defaultTitle: "Shank Strategy Ops",
  defaultDescription,
  publisher: {
    "@type": "Organization",
    name: "Shank Strategy Ops",
    url: "https://shankstrategy.com",
    email: "contact@shankstrategy.com",
    description: defaultDescription,
  },
  ads: {
    adsenseClient: "ca-pub-9310837374819126",
    enableBlogAds: false,
  },
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
