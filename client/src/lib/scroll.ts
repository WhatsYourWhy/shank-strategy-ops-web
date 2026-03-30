export const FIXED_HEADER_OFFSET = 112;
export const STACKED_HEADER_OFFSET = 176;

interface ScrollOptions {
  focusTarget?: string | HTMLElement | null;
  offset?: number;
}

function resolveElement(target?: string | HTMLElement | null) {
  if (!target) {
    return null;
  }

  return typeof target === "string" ? document.getElementById(target) : target;
}

export function scrollToElementWithOffset(
  target: string | HTMLElement,
  options: number | ScrollOptions = FIXED_HEADER_OFFSET
) {
  if (typeof window === "undefined") {
    return false;
  }

  const element = resolveElement(target);

  if (!element) {
    return false;
  }

  const normalizedOptions =
    typeof options === "number" ? { offset: options } : options;
  const offset = normalizedOptions.offset ?? FIXED_HEADER_OFFSET;
  const focusTarget = resolveElement(normalizedOptions.focusTarget) ?? element;

  if (focusTarget instanceof HTMLElement) {
    focusTarget.focus({ preventScroll: true });
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
