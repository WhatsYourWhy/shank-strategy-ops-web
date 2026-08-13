/**
 * Format a `YYYY-MM-DD` publish date for display.
 *
 * `new Date("2026-07-19")` is parsed as UTC midnight, so formatting it in the
 * viewer's local time renders the previous day anywhere west of Greenwich.
 * Pinning to UTC keeps the rendered date equal to the date in the source data,
 * and keeps the build-time prerender byte-identical to the client render.
 */
export function formatPublishedDate(publishedDate: string): string {
  return new Date(publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
