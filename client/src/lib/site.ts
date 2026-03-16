export const siteConfig = {
  name: "Shank Strategy Ops",
  url: "https://shankstrategy.com",
  email: "contact@shankstrategy.com",
  defaultTitle: "Shank Strategy Ops",
  defaultDescription:
    "Strategy execution, operational excellence, original essays, and deterministic tools for leaders who need systems that hold under real operating conditions.",
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
