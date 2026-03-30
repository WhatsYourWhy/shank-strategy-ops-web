import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

const ADSENSE_SCRIPT_ID = "blog-adsense-script";
const ADSENSE_META_SELECTOR = 'meta[name="google-adsense-account"]';

export default function BlogAdsScript() {
  useEffect(() => {
    if (!siteConfig.ads.enableBlogAds) {
      return;
    }

    const meta =
      document.head.querySelector<HTMLMetaElement>(ADSENSE_META_SELECTOR) ??
      document.createElement("meta");
    meta.setAttribute("name", "google-adsense-account");
    meta.setAttribute("content", siteConfig.ads.adsenseClient);

    if (!meta.parentElement) {
      document.head.appendChild(meta);
    }

    const script =
      document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null ??
      document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.ads.adsenseClient}`;

    if (!script.parentElement) {
      document.head.appendChild(script);
    }

    return () => {
      script.remove();

      const activeRouteStillAllowsAds = window.location.pathname.startsWith("/blog");
      if (!activeRouteStillAllowsAds) {
        meta.remove();
      }
    };
  }, []);

  return null;
}
