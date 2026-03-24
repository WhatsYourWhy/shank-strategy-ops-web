const HOME_SCROLL_KEY = "home-scroll-target";

export function queueHomeSectionNavigation(
  id: string,
  navigateHome: (path: string) => void
) {
  if (typeof window === "undefined") {
    navigateHome("/");
    return;
  }

  window.sessionStorage.setItem(HOME_SCROLL_KEY, id);
  navigateHome("/");
}

export function consumeHomeSectionNavigation() {
  if (typeof window === "undefined") {
    return null;
  }

  const pendingSection = window.sessionStorage.getItem(HOME_SCROLL_KEY);
  if (pendingSection) {
    window.sessionStorage.removeItem(HOME_SCROLL_KEY);
    return pendingSection;
  }

  if (window.location.hash.startsWith("#")) {
    return window.location.hash.slice(1);
  }

  return null;
}
