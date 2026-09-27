/**
 * api.js  — thin API client layer
 *
 * All backend calls live here. UI components import from this module only —
 * they never construct fetch() calls directly.
 *
 * ── IBM Bob integration point ────────────────────────────────────────────────
 * When the Bob agent workflow is connected, the backend /api/analyze endpoint
 * will invoke Bob internally.  No changes are needed in this file.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Configure API base URL: uses VITE_API_URL in production if set, falling back to /api for local dev proxy
const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')
const BASE_URL = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) : '/api'

/**
 * Send a change description to the backend and receive a full analysis report.
 *
 * @param {string} changeDescription
 * @returns {Promise<object>} AnalysisReport
 */
export async function analyzeChange(changeDescription) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changeDescription }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed with status ${res.status}`)
  }

  return res.json()
}

/**
 * Health check – can be used to verify the backend is reachable.
 * @returns {Promise<object>}
 */
export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`)
  return res.json()
}
