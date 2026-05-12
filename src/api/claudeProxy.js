// Claude API proxy client.
// All calls to the Anthropic API must go through this function, not by calling
// api.anthropic.com directly from the browser.
//
// In development: Vite proxies /api/claude → http://localhost:8787 (wrangler dev).
// In production: /api/claude is served by the Cloudflare Worker in server/proxy.js.
// If VITE_CLAUDE_PROXY_URL is set (e.g. full domain), that URL is used instead.

const PROXY_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CLAUDE_PROXY_URL)
  ? import.meta.env.VITE_CLAUDE_PROXY_URL
  : '/api/claude';

/**
 * Send a request to the Claude API via the server-side proxy.
 * @param {object} payload - Anthropic messages API request body (model, messages, etc.)
 * @returns {Promise<object>} Anthropic messages API response
 */
export async function callClaude(payload) {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Claude proxy error (${response.status}): ${errText.slice(0, 200)}`);
  }

  return response.json();
}
