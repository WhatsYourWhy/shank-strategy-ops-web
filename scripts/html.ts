/** Shared by generate-route-html.ts and verify-prerender.ts so the escaping the
 *  generator writes and the escaping the verifier expects can never drift. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const EMPTY_ROOT = '<div id="root"></div>';
const ROOT_OPEN = '<div id="root">';
const ROOT_CLOSE = "</div>";

interface RootSpan {
  /** Index of the opening `<div id="root">`. */
  start: number;
  /** Index just past its matching `</div>`. */
  end: number;
  /** Everything between the two — the rendered app, or "" before prerendering. */
  inner: string;
}

/**
 * Locate the root div and its matching close tag.
 *
 * Both callers need to know exactly where `#root` ends: the generator to reset
 * it, the verifier to measure only what is inside it. Keeping one definition
 * here means those two answers cannot disagree.
 *
 * Counts `<div` against `</div>` rather than reaching for the last `</div>` in
 * the file. React escapes text content, so a literal "<div" in prose can never
 * appear in the markup — only real tags.
 */
export function findRootSpan(html: string): RootSpan | null {
  const start = html.indexOf(ROOT_OPEN);
  if (start === -1) {
    return null;
  }

  const innerStart = start + ROOT_OPEN.length;
  let depth = 0;
  let cursor = start;

  while (cursor < html.length) {
    const open = html.indexOf("<div", cursor);
    const close = html.indexOf(ROOT_CLOSE, cursor);

    if (close === -1) {
      return null;
    }

    if (open !== -1 && open < close) {
      depth += 1;
      cursor = open + 4;
      continue;
    }

    depth -= 1;
    cursor = close + ROOT_CLOSE.length;

    if (depth === 0) {
      return { start, end: cursor, inner: html.slice(innerStart, close) };
    }
  }

  return null;
}
