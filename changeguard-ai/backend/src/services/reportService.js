/**
 * reportService.js
 *
 * Assembles all analysis artefacts into a single, stable AnalysisReport object.
 * The shape of this object is the contract between the backend and the React
 * frontend — it must not change without updating both sides.
 *
 * ── IBM Bob integration point ────────────────────────────────────────────────
 * The inputs to buildReport() will be populated by real Bob agent results once
 * the workflow is connected.  The output shape intentionally stays unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Build the final AnalysisReport.
 *
 * @param {object} params
 * @param {string}   params.changeDescription
 * @param {string}   params.repository
 * @param {object[]} params.changedFiles
 * @param {object[]} params.impactedFiles
 * @param {object[]} params.testGaps
 * @param {object[]} params.generatedTests
 * @param {object}   params.validation
 * @returns {object} AnalysisReport
 */
function buildReport({
  changeDescription,
  repository,
  changedFiles,
  impactedFiles,
  testGaps,
  generatedTests,
  validation,
}) {
  const defectsFound = validation.defectsFound ?? [];

  return {
    meta: {
      repository,
      analyzedAt: new Date().toISOString(),
      // Clearly labels these as demo results until Bob is connected
      dataSource: 'DEMO — controlled change-impact-demo demonstration data',
      changeDescription,
    },
    summary: {
      filesChanged: changedFiles.length,
      filesImpacted: impactedFiles.length,
      testGapsFound: testGaps.length,
      testsGenerated: generatedTests.length,
      defectsFound: defectsFound.length,
      testsBefore: validation.before.totalTests,
      testsAfter: validation.after.totalTests,
      passedBefore: validation.before.passed,
      passedAfter: validation.after.passed,
      failedBefore: validation.before.failed,
      failedAfter: validation.after.failed,
    },
    changedFiles,
    impactedFiles,
    testGaps,
    generatedTests,
    validation,
  };
}

module.exports = { buildReport };
