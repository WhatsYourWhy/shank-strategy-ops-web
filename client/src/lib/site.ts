const defaultDescription =
  "Strategy execution, operational excellence, original essays, and deterministic tools for leaders who need systems that hold under real operating conditions.";

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
    enableBlogAds: true,
  },
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
