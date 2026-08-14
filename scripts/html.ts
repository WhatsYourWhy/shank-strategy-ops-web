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

/**
 * Inner HTML of the page's `<main>` element, or null if there isn't one.
 *
 * Every route renders exactly one `<main id="main-content">`, with the nav and
 * footer outside it, so this is the page's own content without the chrome that
 * repeats on all 21 routes. Nested `<main>` is invalid HTML, so a plain scan to
 * the next `</main>` is correct — no depth counting needed.
 */
export function extractMainHtml(html: string): string | null {
  const open = html.search(/<main[\s>]/);
  if (open === -1) {
    return null;
  }

  const innerStart = html.indexOf(">", open);
  const close = html.indexOf("</main>", innerStart);
  if (innerStart === -1 || close === -1) {
    return null;
  }

  return html.slice(innerStart + 1, close);
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
};

/** Single pass, so an escaped entity like `&amp;lt;` decodes once to `&lt;`
 *  rather than twice to `<`. */
function decodeEntities(value: string) {
  return value.replace(
    /&(?:amp|lt|gt|quot|#39|#x27|nbsp|mdash|ndash|hellip);/g,
    match => ENTITIES[match]
  );
}

const MAX_HEADING_LEVEL = 6;

/**
 * Render markup down to readable plain text, keeping heading levels and list
 * items so the result stays navigable rather than collapsing into one blob.
 *
 * `headingOffset` demotes every heading by that many levels, so page content
 * can be nested under a heading the caller supplies without an in-page `<h1>`
 * colliding with it.
 */
export function htmlToText(html: string, headingOffset = 0): string {
  let text = html;

  // Headings carry their level through as markdown so structure survives.
  for (let level = 1; level <= MAX_HEADING_LEVEL; level += 1) {
    const depth = Math.min(level + headingOffset, MAX_HEADING_LEVEL);
    text = text.replace(
      new RegExp(`<h${level}[\\s>]`, "gi"),
      `\n\n${"#".repeat(depth)} <h${level} `
    );
  }

  text = text
    .replace(/<li[\s>]/gi, "\n- <li ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(
      /<\/(p|div|section|article|footer|header|ul|ol|li|blockquote|h[1-6])>/gi,
      "\n"
    )
    // Strip all remaining markup, including React's `<!-- -->` text separators.
    .replace(/<[^>]*>/g, " ");

  return decodeEntities(text)
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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
