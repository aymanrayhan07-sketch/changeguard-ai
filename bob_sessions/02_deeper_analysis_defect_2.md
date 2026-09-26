
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ChangeGuard AI — Agentic Workflow Report</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, "Segoe UI", system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    background: #ffffff;
    color: #1f2328;
    padding: 32px 16px 48px;
  }
  .page { max-width: 760px; margin: 0 auto; }
  h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
  .subtitle { color: #57606a; font-size: 13px; margin-bottom: 32px; }
  h2 { font-size: 15px; font-weight: 700; margin: 28px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  h3 { font-size: 13px; font-weight: 600; margin: 14px 0 6px; color: #3b82d4; }
  p { margin-bottom: 8px; }
  code { background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 3px; padding: 1px 5px; font-size: 12px; font-family: "SFMono-Regular", Consolas, monospace; }
  pre { background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 5px; padding: 12px 14px; font-size: 12px; font-family: "SFMono-Regular", Consolas, monospace; overflow-x: auto; margin-bottom: 12px; white-space: pre-wrap; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13px; }
  th { background: #f7f8fa; text-align: left; padding: 7px 10px; border: 1px solid #e5e7eb; font-weight: 600; }
  td { padding: 6px 10px; border: 1px solid #e5e7eb; vertical-align: top; }
  tr:nth-child(even) td { background: #fafafa; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
  .high { background: #fde8e8; color: #c0392b; }
  .medium { background: #fef3cd; color: #856404; }
  .low { background: #e3f0ff; color: #2563aa; }
  .pass { background: #d1fae5; color: #065f46; }
  .fail { background: #fde8e8; color: #c0392b; }
  .fixed { background: #ede9fe; color: #5b21b6; }
  .info { background: #e3f0ff; color: #1e40af; }
  .defect-box { background: #fff8e1; border: 1px solid #f0c040; border-radius: 5px; padding: 12px 14px; margin: 10px 0; }
  .fix-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 5px; padding: 12px 14px; margin: 10px 0; }
  .summary-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
  .card { flex: 1 1 140px; background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px 16px; }
  .card .num { font-size: 26px; font-weight: 700; color: #3b82d4; }
  .card .lbl { font-size: 11px; color: #57606a; text-transform: uppercase; letter-spacing: 0.04em; }
  .status-final { font-size: 18px; font-weight: 700; color: #065f46; background: #d1fae5; border-radius: 6px; padding: 14px 18px; margin-top: 20px; display: inline-block; }
  footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #57606a; }
  .stage-num { display: inline-block; background: #3b82d4; color: #fff; border-radius: 50%; width: 22px; height: 22px; text-align: center; line-height: 22px; font-size: 11px; font-weight: 700; margin-right: 6px; }
  ul { padding-left: 20px; margin-bottom: 8px; }
  li { margin-bottom: 3px; }
  .flow { display: flex; gap: 0; flex-wrap: wrap; margin: 10px 0 16px; }
  .flow-step { background: #f7f8fa; border: 1px solid #e5e7eb; padding: 6px 12px; font-size: 12px; display: flex; align-items: center; }
  .flow-step:not(:last-child)::after { content: "→"; margin-left: 8px; color: #57606a; }
  .diff-line { font-family: "SFMono-Regular", Consolas, monospace; font-size: 12px; }
  .diff-add { background: #e6ffec; color: #22543d; }
  .diff-ctx { color: #57606a; }
</style>
</head>
<body>
<div class="page">

  <h1>ChangeGuard AI — Agentic Workflow Report</h1>
  <p class="subtitle">IBM Bob 2.0 · Repository: <code>change-impact-demo</code> · Change: discount-code feature · Run completed</p>

  
  <div class="summary-row">
    <div class="card"><div class="num">3</div><div class="lbl">Changed Files</div></div>
    <div class="card"><div class="num">5</div><div class="lbl">Impacted Files</div></div>
    <div class="card"><div class="num">83</div><div class="lbl">Tests Before</div></div>
    <div class="card"><div class="num">89</div><div class="lbl">Tests After</div></div>
    <div class="card"><div class="num">1</div><div class="lbl">Defect Found</div></div>
    <div class="card"><div class="num">1</div><div class="lbl">Fix Applied</div></div>
  </div>

  
  <h2><span class="stage-num">1</span>Change Understanding</h2>
  <p><strong>Change description:</strong> Introduced a 10% discount-code feature. Added <code>DISCOUNT_CODES</code> registry to <code>constants.js</code>. Extended <code>paymentService.processPayment()</code> to accept a <code>discountCode</code>, validate it, and charge the discounted amount. Updated <code>orderService.placeOrder()</code> to pass the code through and record both <code>cartTotal</code> and the discounted <code>total</code> on the order.</p>

  <h3>Changed Files</h3>
  <table>
    <tr><th>File</th><th>What Changed</th></tr>
    <tr><td><code>src/config/constants.js</code></td><td>Added <code>DISCOUNT_CODES</code> object (<code>SAVE10: 10</code>, <code>WELCOME10: 10</code>); exported it.</td></tr>
    <tr><td><code>src/modules/payments/paymentService.js</code></td><td>Added discount resolution logic: validates code, computes <code>finalAmount</code> via <code>parseFloat((amount * (1 - pct/100)).toFixed(2))</code>, records <code>originalAmount</code>, <code>discountCode</code>, <code>discountPercent</code> on payment record.</td></tr>
    <tr><td><code>src/modules/orders/orderService.js</code></td><td>Added <code>discountCode</code> parameter to <code>placeOrder()</code>; passes it to <code>processPayment()</code>; stores both <code>cartTotal</code> and <code>total: payment.amount</code> on the order record. Also added stock-restore logic on payment failure (pre-existing fix).</td></tr>
  </table>

  <h3>Behaviour That Changed</h3>
  <ul>
    <li>Payment amount charged to customer can now be less than cart total when a valid discount code is supplied.</li>
    <li>Order record now distinguishes <code>cartTotal</code> (gross) from <code>total</code> (net charged).</li>
    <li>Invalid codes throw immediately — order is never persisted in that case.</li>
    <li>Empty-string <code>discountCode</code> is treated as <em>no discount</em> (falsy guard).</li>
  </ul>

  
  <h2><span class="stage-num">2</span>Impact Analysis</h2>

  <h3>Dependency Graph (discount-code blast radius)</h3>
  <div class="flow">
    <div class="flow-step">constants.js<br /><small>DISCOUNT_CODES added</small></div>
    <div class="flow-step">paymentService.js<br /><small>consumes DISCOUNT_CODES</small></div>
    <div class="flow-step">orderService.js<br /><small>passes discountCode</small></div>
    <div class="flow-step">cartService.js<br /><small>getCartTotal called</small></div>
    <div class="flow-step">notificationService.js<br /><small>notified with new total</small></div>
  </div>

  <h3>Impact Levels</h3>
  <table>
    <tr><th>Module</th><th>Impact</th><th>Reason</th></tr>
    <tr><td><code>paymentService.js</code></td><td><span class="badge high">HIGH</span></td><td>Core logic change — discount computation, amount charged, new record fields.</td></tr>
    <tr><td><code>orderService.js</code></td><td><span class="badge high">HIGH</span></td><td>Orchestrates the discount; order total now diverges from cart total.</td></tr>
    <tr><td><code>constants.js</code></td><td><span class="badge medium">MEDIUM</span></td><td>New shared config consumed by paymentService; any future consumer inherits discount table.</td></tr>
    <tr><td><code>notificationService.js</code></td><td><span class="badge low">LOW</span></td><td>Receives discounted total in payload — no logic change, but payload shape changed.</td></tr>
    <tr><td><code>cartService.js</code></td><td><span class="badge low">LOW</span></td><td>Unchanged; <code>getCartTotal()</code> still returns gross total — used as input to discount.</td></tr>
    <tr><td><code>authService.js</code>, <code>userService.js</code>, <code>productService.js</code></td><td><span class="badge low">LOW</span></td><td>No direct dependency on discount path; indirectly impacted only via shared DB state.</td></tr>
  </table>

  
  <h2><span class="stage-num">3</span>Test Impact Analysis</h2>
  <h3>Existing Tests Reviewed</h3>
  <table>
    <tr><th>Test File</th><th>Status</th><th>Notes</th></tr>
    <tr><td><code>tests/unit/paymentService.test.js</code></td><td><span class="badge pass">ADEQUATE</span></td><td>Covers SAVE10, WELCOME10, invalid code, null code, failed payment with discount.</td></tr>
    <tr><td><code>tests/unit/orderService.test.js</code></td><td><span class="badge medium">PARTIAL</span></td><td>Covers placeOrder with SAVE10. <strong>cancelOrder missing stock assertion.</strong></td></tr>
    <tr><td><code>tests/regression/discountRegressions.test.js</code></td><td><span class="badge pass">ADEQUATE</span></td><td>Covers Gaps 1–6: stock restore on payment failure, refund amount, FP precision, empty string, no-bleed, cart preservation.</td></tr>
    <tr><td><code>tests/integration/purchaseFlow.test.js</code></td><td><span class="badge pass">ADEQUATE</span></td><td>End-to-end discount path (WELCOME10) confirmed.</td></tr>
  </table>

  <h3>Identified Gaps</h3>
  <p><strong>Gap 7 (NEW — discovered this run):</strong> <code>cancelOrder()</code> was extended to handle refunds when the discount feature was introduced, but stock-restore logic was never added. When a customer cancels a confirmed order (whether discounted or not), the stock decremented at order-placement time is <em>permanently lost</em> from inventory. No existing test asserts post-cancellation stock levels.</p>

  
  <h2><span class="stage-num">4</span>Regression Tests Generated</h2>
  <p>New file: <code>tests/regression/cancelOrderStockRestore.test.js</code> — 6 tests across 4 sub-scenarios.</p>
  <table>
    <tr><th>Gap</th><th>Scenario</th><th>Test Case</th></tr>
    <tr><td>7A</td><td>Plain confirmed order cancelled</td><td>stock returns to pre-order level</td></tr>
    <tr><td>7B-1</td><td>Discounted confirmed order cancelled</td><td>stock returns to pre-order level</td></tr>
    <tr><td>7B-2</td><td>Discounted confirmed order cancelled</td><td>refund amount = discounted total (not cart total)</td></tr>
    <tr><td>7C</td><td>Multi-item order cancelled</td><td>all product stock lines restored independently</td></tr>
    <tr><td>7D-1</td><td>Status invariant</td><td>placeOrder always resolves to CONFIRMED or CANCELLED</td></tr>
    <tr><td>7D-2</td><td>Status invariant</td><td>failed-payment order exits as CANCELLED (not PENDING)</td></tr>
  </table>

  
  <h2><span class="stage-num">5</span>Validation — Tests Before Fix</h2>
  <table>
    <tr><th>Test</th><th>Result</th><th>Detail</th></tr>
    <tr><td>Gap 7A — stock restore (plain)</td><td><span class="badge fail">FAIL</span></td><td>Expected stock 10, received 7 after cancelOrder</td></tr>
    <tr><td>Gap 7B — stock restore (discounted)</td><td><span class="badge fail">FAIL</span></td><td>Expected stock 10, received 8 after cancelOrder</td></tr>
    <tr><td>Gap 7B — refund = discounted total</td><td><span class="badge pass">PASS</span></td><td>Refund mechanism already correct</td></tr>
    <tr><td>Gap 7C — multi-item restore</td><td><span class="badge fail">FAIL</span></td><td>Expected stock 10, received 6 (product 1 not restored)</td></tr>
    <tr><td>Gap 7D — status invariants (×2)</td><td><span class="badge pass">PASS</span></td><td>No PENDING orders leak from placeOrder</td></tr>
    <tr><td>All 83 pre-existing tests</td><td><span class="badge pass">83/83 PASS</span></td><td>Baseline suite unaffected</td></tr>
  </table>

  
  <h2><span class="stage-num">6</span>Defect &amp; Repair</h2>

  <div class="defect-box">
    <strong>Defect confirmed:</strong> <code>cancelOrder()</code> in <code>src/modules/orders/orderService.js</code> did not restore product stock on cancellation of a confirmed order.<br />
    <strong>Impact:</strong> HIGH — inventory permanently lost on every customer cancellation, regardless of whether a discount code was used.<br />
    <strong>Root cause:</strong> Stock-restore logic was added to the <em>payment-failure</em> path of <code>placeOrder()</code> during the discount-code change, but the equivalent logic was never ported to <code>cancelOrder()</code>.
  </div>

  <h3>Minimal Fix Applied</h3>
  <p>File: <code>src/modules/orders/orderService.js</code> — 4 lines added to <code>cancelOrder()</code>:</p>
  <pre><span class="diff-ctx">  order.status = ORDER_STATUS.CANCELLED;
  order.updatedAt = new Date().toISOString();
</span><span class="diff-add">
+  // Restore stock for every item that was decremented when the order was placed.
+  order.items.forEach((item) =&gt; {
+    const product = productService.getProductById(item.productId);
+    productService.updateProduct(item.productId, { stock: product.stock + item.quantity });
+  });
</span><span class="diff-ctx">
  // Refund any successful payment
  const payments = paymentService.getPaymentsByOrder(orderId);</span></pre>

  <div class="fix-box">
    <strong>Fix rationale:</strong> <code>order.items</code> is a snapshot taken at placement time — it is immutable and already contains <code>productId</code> and <code>quantity</code> for every line. The same pattern already used in <code>placeOrder()</code>'s failure path is directly reused here. No other production files were modified.
  </div>

  
  <h2><span class="stage-num">7</span>Final Report</h2>

  <h3>Structured Summary</h3>
  <pre>{
  "changedFiles": [
    "src/config/constants.js",
    "src/modules/payments/paymentService.js",
    "src/modules/orders/orderService.js"
  ],
  "impactedFiles": [
    { "file": "paymentService.js",      "level": "HIGH"   },
    { "file": "orderService.js",        "level": "HIGH"   },
    { "file": "constants.js",           "level": "MEDIUM" },
    { "file": "notificationService.js", "level": "LOW"    },
    { "file": "cartService.js",         "level": "LOW"    }
  ],
  "testGaps": [
    "Gap 7: cancelOrder() never asserts stock restoration (4 sub-scenarios)"
  ],
  "generatedTests": "tests/regression/cancelOrderStockRestore.test.js (6 tests)",
  "testsBefore": { "suites": 9, "total": 83, "passed": 83, "failed": 0 },
  "testsAfter":  { "suites": 10, "total": 89, "passed": 89, "failed": 0 },
  "defectsFound": [
    {
      "id": "DEF-001",
      "file": "src/modules/orders/orderService.js",
      "function": "cancelOrder()",
      "description": "Product stock not restored when a confirmed order is cancelled",
      "impact": "HIGH — inventory leak on every order cancellation",
      "confirmedBy": "3 failing generated tests (7A, 7B, 7C)"
    }
  ],
  "fixesApplied": [
    {
      "defect": "DEF-001",
      "file": "src/modules/orders/orderService.js",
      "change": "Added 4-line order.items.forEach stock-restore block inside cancelOrder()",
      "linesChanged": 4
    }
  ],
  "finalStatus": "ALL_GREEN — 89/89 tests passing, 0 regressions introduced"
}</pre>

  <h2>IBM Bob Capabilities Used</h2>
  <table>
    <tr><th>Capability</th><th>Used For</th></tr>
    <tr><td>Repository inspection (<code>read_file</code>, <code>grep</code>, <code>glob</code>)</td><td>Read all 7 source files + 9 test files; traced DISCOUNT_CODES through the import graph</td></tr>
    <tr><td>Symbol-level code understanding (<code>GetSymbolsOverview</code>, <code>FindSymbol</code>)</td><td>Mapped module exports, identified <code>cancelOrder()</code> as the missing-logic site</td></tr>
    <tr><td>Dependency tracing (<code>FindReferencingSymbols</code>, <code>grep</code>)</td><td>Confirmed which modules import <code>DISCOUNT_CODES</code> and <code>processPayment</code></td></tr>
    <tr><td>Test file generation (<code>write_file</code>)</td><td>Authored <code>cancelOrderStockRestore.test.js</code> — 6 targeted tests, 4 scenarios</td></tr>
    <tr><td>Test execution (<code>execute_command</code> → Jest)</td><td>Ran targeted suite to confirm 3 failures = genuine defects; re-ran full suite after fix</td></tr>
    <tr><td>Surgical code repair (<code>apply_diff</code>)</td><td>Applied minimal 4-line fix to <code>cancelOrder()</code></td></tr>
    <tr><td>Structured reporting (<code>create_html_artifact</code>)</td><td>This document</td></tr>
  </table>

  <div class="status-final">✓ Final Status: ALL_GREEN — 89 / 89 tests passing · 0 regressions</div>

  <footer>Made with IBM Bob</footer>
</div>
</body>
</html>
