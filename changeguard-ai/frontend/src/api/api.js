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

// Default production backend on Render
const DEFAULT_PROD_API_URL = 'https://changeguard-ai-9zml.onrender.com'

// Configure API base URL: uses VITE_API_URL if set, falling back to Render production backend in prod or /api in dev
const configuredUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? DEFAULT_PROD_API_URL : '')
const rawApiUrl = configuredUrl.trim().replace(/\/+$/, '')
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

  const text = await res.text()

  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`
    try {
      const body = JSON.parse(text)
      if (body.error) errorMsg = body.error
    } catch {}
    throw new Error(errorMsg)
  }

  if (!text) {
    throw new Error('Server returned an empty response. Verify backend is reachable.')
  }

  try {
    return JSON.parse(text)
  } catch (_e) {
    throw new Error(`Unexpected non-JSON response from server: ${text.slice(0, 100)}`)
  }
}

/**
 * Health check – can be used to verify the backend is reachable.
 * @returns {Promise<object>}
 */
export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`)
  const text = await res.text()
  return text ? JSON.parse(text) : {}
}
