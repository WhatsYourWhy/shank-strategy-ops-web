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
