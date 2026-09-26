/**
 * POST /api/analyze
 *
 * Accepts a change description and returns a full analysis report.
 *
 * Request body:
 *   { "changeDescription": "string" }
 *
 * Response:
 *   Full AnalysisReport object (see reportService.js)
 *
 * ── IBM Bob integration point ────────────────────────────────────────────────
 * When the Bob agent workflow is connected, the analysisService.runAnalysis()
 * call below will be replaced (or augmented) with an async Bob agent invocation
 * that uses the change description as a prompt and the repository path as
 * context.  The response shape should remain the same so no frontend changes
 * are needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();
const analysisService = require('../services/analysisService');

router.post('/analyze', async (req, res) => {
  const { changeDescription } = req.body;

  if (!changeDescription || typeof changeDescription !== 'string' || !changeDescription.trim()) {
    return res.status(400).json({ error: 'changeDescription is required and must be a non-empty string' });
  }

  try {
    const report = await analysisService.runAnalysis(changeDescription.trim());
    res.json(report);
  } catch (err) {
    console.error('[/api/analyze] Error:', err);
    res.status(500).json({ error: 'Analysis failed', detail: err.message });
  }
});

module.exports = router;
