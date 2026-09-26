/**
 * analysisService.js
 *
 * Orchestrates the full change-impact analysis pipeline:
 *
 *   1. Understand repository context
 *   2. Identify directly changed files
 *   3. Map cascading impact across the dependency graph
 *   4. Detect test gaps
 *   5. Generate regression test suggestions
 *   6. Run / simulate test validation
 *   7. Assemble the final report
 *
 * Current implementation uses deterministic demo data derived from the real
 * controlled demonstration we ran on change-impact-demo.
 *
 * ── IBM Bob integration point ────────────────────────────────────────────────
 * Replace the individual _analyse* helpers below with Bob agent tool calls.
 * Each helper maps cleanly to one agent step:
 *
 *   _analyzeChangedFiles()   → Bob: read changed files, extract diff
 *   _analyzeImpact()         → Bob: traverse import graph, flag dependents
 *   _analyzeTestGaps()       → Bob: compare coverage to changed lines
 *   _generateTests()         → Bob: generate Jest test stubs
 *   _runValidation()         → Bob: execute jest --runInBand, parse output
 *
 * The report shape returned by runAnalysis() must stay stable so no frontend
 * changes are needed when Bob is wired in.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const repositoryService = require('./repositoryService');
const reportService = require('./reportService');
const testService = require('./testService');

/**
 * Run the full analysis pipeline for a given change description.
 *
 * @param {string} changeDescription  Free-text description of the change
 * @returns {Promise<object>}         Full AnalysisReport
 */
async function runAnalysis(changeDescription) {
  // ── Step 1: Load repository context ──────────────────────────────────────
  const repoContext = repositoryService.getRepositoryContext();

  // ── Step 2: Identify directly changed files ───────────────────────────────
  // Bob hook: replace with diff/AST analysis of the actual change
  const changedFiles = _analyzeChangedFiles(changeDescription);

  // ── Step 3: Map cascading impact ─────────────────────────────────────────
  // Bob hook: replace with real import-graph traversal
  const impactedFiles = _analyzeImpact(changedFiles, repoContext);

  // ── Step 4: Detect test gaps ──────────────────────────────────────────────
  // Bob hook: replace with coverage-diff analysis
  const testGaps = _analyzeTestGaps(changedFiles, repoContext);

  // ── Step 5: Generate regression tests ────────────────────────────────────
  // Bob hook: replace with Bob-generated Jest test stubs
  const generatedTests = testService.generateRegressionTests(testGaps);

  // ── Step 6: Simulate / run test validation ────────────────────────────────
  // Bob hook: replace with real jest subprocess execution
  const validation = testService.getValidationResults();

  // ── Step 7: Assemble and return report ───────────────────────────────────
  return reportService.buildReport({
    changeDescription,
    repository: repoContext.name,
    changedFiles,
    impactedFiles,
    testGaps,
    generatedTests,
    validation,
  });
}

// ─── Private helpers (demo implementations) ──────────────────────────────────

/**
 * Returns the files directly modified by the change.
 * Demo data: matches the real discount-code change we implemented.
 *
 * Bob hook: parse git diff / AST of the change description to identify files.
 */
function _analyzeChangedFiles(_changeDescription) {
  return [
    {
      path: 'src/config/constants.js',
      severity: 'medium',
      reason: 'Added DISCOUNT_CODES registry — new shared configuration consumed by paymentService',
    },
    {
      path: 'src/modules/payments/paymentService.js',
      severity: 'high',
      reason: 'processPayment() now accepts discountCode, applies 10% reduction, and records discount metadata on the payment record',
    },
    {
      path: 'src/modules/orders/orderService.js',
      severity: 'high',
      reason: 'placeOrder() accepts and forwards discountCode; order.total now reflects discounted amount; stock-restore logic added to payment-failure path',
    },
  ];
}

/**
 * Returns files that may be impacted by the changed files but were not
 * directly modified.
 *
 * Bob hook: walk the require() / import graph outward from changedFiles.
 */
function _analyzeImpact(changedFiles, _repoContext) {
  return [
    {
      path: 'src/modules/cart/cartService.js',
      severity: 'low',
      reason: 'Consumed by orderService. If discount logic is ever surfaced at cart level (e.g. preview discounted total), this module will require changes.',
    },
    {
      path: 'src/modules/notifications/notificationService.js',
      severity: 'low',
      reason: 'ORDER_CONFIRMED notification payload now carries the discounted total. Any consumer that assumed payload.total === cartTotal will see changed values.',
    },
    {
      path: 'src/index.js',
      severity: 'low',
      reason: 'Smoke-test entry point still calls placeOrder without discountCode. Harmless today but should be updated to demonstrate the new feature.',
    },
    {
      path: 'README.md',
      severity: 'low',
      reason: 'placeOrder parameter table and architecture docs are now stale.',
    },
    {
      path: 'future: order controller / HTTP route handler',
      severity: 'medium',
      reason: 'Any HTTP route wrapping placeOrder must extract discountCode from the request body and forward it.',
    },
    {
      path: 'future: invoice / receipt generator',
      severity: 'medium',
      reason: 'Must show cartTotal, discountCode, amount saved, and final total as separate line items.',
    },
  ];
}

/**
 * Returns regression gaps identified for the INITIAL analysis cycle.
 * These 6 gaps correspond to the first test run (83 tests, 82 passed, 1 failed).
 *
 * The cancelOrder() regression gap (gap-7) was discovered in a SECOND, deeper
 * analysis cycle after Defect #1 was fixed.  It is represented in the workflow
 * narrative and in validation.defectsFound but is NOT part of this initial list,
 * so that testGapsFound and testsGenerated correctly reflect the initial cycle (6).
 *
 * Bob hook: compare changed lines against existing test coverage map;
 * use LLM to reason about untested code paths and edge cases.
 */
function _analyzeTestGaps(_changedFiles, _repoContext) {
  return [
    {
      id: 'gap-1',
      title: 'Stock not restored after failed-payment discounted order',
      severity: 'high',
      description: 'When payment fails, stock was decremented before processPayment but never restored. This leaves inventory in an incorrect state on payment failure.',
      affectedModule: 'src/modules/orders/orderService.js',
      defectFound: true,
    },
    {
      id: 'gap-2',
      title: 'Refund amount equals discounted total, not cart total',
      severity: 'medium',
      description: 'Cancelling a discounted confirmed order should refund the discounted amount (what was actually charged), not the original cart total.',
      affectedModule: 'src/modules/payments/paymentService.js',
      defectFound: false,
    },
    {
      id: 'gap-3',
      title: 'Floating-point precision for non-round product prices',
      severity: 'low',
      description: '10% of $99.99 = $89.991. The implementation uses parseFloat(…toFixed(2)) — must confirm it rounds correctly for all inputs.',
      affectedModule: 'src/modules/payments/paymentService.js',
      defectFound: false,
    },
    {
      id: 'gap-4',
      title: 'Empty-string discount code treated as no discount',
      severity: 'low',
      description: 'Passing discountCode: "" should behave identically to no code. The falsy guard `if (discountCode)` handles this but it was untested.',
      affectedModule: 'src/modules/payments/paymentService.js',
      defectFound: false,
    },
    {
      id: 'gap-5',
      title: 'Consecutive orders with different codes do not bleed',
      severity: 'medium',
      description: 'Second order placed without a code must not inherit the discount from a previous order in the same session.',
      affectedModule: 'src/modules/orders/orderService.js',
      defectFound: false,
    },
    {
      id: 'gap-6',
      title: 'Cart preserved after failed payment',
      severity: 'low',
      description: 'Cart must remain intact on payment failure so the user can correct and retry. This is correct behaviour but was never explicitly tested.',
      affectedModule: 'src/modules/orders/orderService.js',
      defectFound: false,
    },
    // gap-7 (cancelOrder stock restore) belongs to the deeper analysis cycle.
    // It is documented in testService.getValidationResults().defectsFound and in
    // the WorkflowTimeline narrative; it is intentionally excluded here so the
    // Summary correctly shows 6 test gaps and 6 generated tests for the initial cycle.
  ];
}

module.exports = { runAnalysis };
