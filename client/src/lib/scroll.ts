export const FIXED_HEADER_OFFSET = 112;
export const STACKED_HEADER_OFFSET = 176;

export function scrollToElementWithOffset(
  target: string | HTMLElement,
  offset = FIXED_HEADER_OFFSET
) {
  if (typeof window === "undefined") {
    return false;
  }

  const element =
    typeof target === "string" ? document.getElementById(target) : target;

  if (!element) {
    return false;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });

  return true;
}

export function replaceHash(hash: string) {
  if (typeof window === "undefined") {
    return;
  }

  const nextUrl = `${window.location.pathname}${window.location.search}#${hash}`;
  window.history.replaceState(null, "", nextUrl);
}
