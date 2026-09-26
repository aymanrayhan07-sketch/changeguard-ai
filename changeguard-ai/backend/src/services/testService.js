/**
 * testService.js
 *
 * Generates regression test descriptions from identified gaps and returns
 * the validation results from test execution.
 *
 * Current implementation returns deterministic demo data matching our real
 * test run on change-impact-demo.
 *
 * ── IBM Bob integration point ────────────────────────────────────────────────
 * generateRegressionTests(): replace with a Bob LLM call that takes each gap
 *   description and produces actual Jest test code as a string.
 *
 * getValidationResults(): replace with a real subprocess execution of
 *   `jest --runInBand --json` in the target repo directory, then parse stdout
 *   into the same result shape.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Converts test gap descriptions into regression test suggestions.
 *
 * @param {object[]} gaps  Array of test gap objects from analysisService
 * @returns {object[]}     Array of generated test descriptions
 */
function generateRegressionTests(gaps) {
  // Bob hook: for each gap, call Bob to generate a concrete Jest test block
  return gaps.map((gap) => ({
    gapId: gap.id,
    title: `[REGRESSION] ${gap.title}`,
    severity: gap.severity,
    affectedModule: gap.affectedModule,
    // Demo: test code as a readable string (Bob would produce real runnable code)
    testCode: _buildTestStub(gap),
    status: gap.defectFound ? 'defect_exposed' : 'confirmed_correct',
  }));
}

/**
 * Returns the before/after test validation results.
 * Matches the real Jest run output from our controlled demonstration.
 *
 * Complete workflow:
 *   Phase 1 — Initial run after discount-code change:  83 tests, 82 pass, 1 fail
 *   Phase 2 — Deeper analysis finds cancelOrder gap:   defect-2 discovered
 *   Phase 3 — Both fixes applied, final run:           89 tests, 89 pass, 0 fail
 *
 * Bob hook: execute `jest --runInBand --json` and parse the output.
 *
 * @returns {object} Validation summary
 */
function getValidationResults() {
  return {
    // ── Phase 1: Initial test run after the discount-code change ────────────
    before: {
      totalTests: 83,
      passed: 82,
      failed: 1,
      failingTests: [
        {
          name: 'Gap 1 — stock not restored after failed-payment discounted order › stock should be restored when a discounted payment fails',
          file: 'tests/regression/discountRegressions.test.js',
          error: 'Expected: 10\nReceived: 7',
        },
      ],
    },
    // ── Phase 3: Final run — both defects fixed, 6 new tests added ──────────
    after: {
      totalTests: 89,
      passed: 89,
      failed: 0,
      testSuitesPassed: 10,
      failingTests: [],
    },
    // ── Both defects discovered and fixed across the full workflow ───────────
    defectsFound: [
      {
        id: 'defect-1',
        title: 'Stock not restored after discounted payment failure',
        severity: 'high',
        file: 'src/modules/orders/orderService.js',
        description:
          'placeOrder() decrements stock before calling processPayment(). When payment fails the CANCELLED branch had no stock-restore logic, leaving inventory permanently reduced. Expected stock: 10 — Received: 7.',
        fix: "Added items.forEach() in the CANCELLED else-branch to call productService.updateProduct() and restore each item's quantity back to stock.",
        status: 'fixed',
        phase: 1,
      },
      {
        id: 'defect-2',
        title: 'cancelOrder() did not restore product stock',
        severity: 'high',
        file: 'src/modules/orders/orderService.js',
        description:
          'Deeper impact analysis revealed that cancelOrder() updated the order status to CANCELLED but never called productService.updateProduct() to restore stock. Cancelling a confirmed order permanently reduced inventory.',
        fix: 'Added stock-restore loop in cancelOrder(): for each item in the cancelled order, productService.updateProduct() restores quantity to its pre-order level.',
        status: 'fixed',
        phase: 2,
      },
    ],
  };
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function _buildTestStub(gap) {
  const stubs = {
    'gap-1': `it('stock should be restored when a discounted payment fails', () => {
  cartService.addToCart(userId, productId, 3);
  orderService.placeOrder({ userId, discountCode: 'SAVE10', simulatePaymentFailure: true });
  const product = productService.getProductById(productId);
  expect(product.stock).toBe(10); // restored from 7 back to 10
});`,
    'gap-2': `it('refunded payment.amount equals the discounted order total', () => {
  cartService.addToCart(userId, productId, 1); // cartTotal = 100
  const { order } = orderService.placeOrder({ userId, discountCode: 'SAVE10' });
  orderService.cancelOrder(order.id);
  const payments = paymentService.getPaymentsByOrder(order.id);
  expect(payments[0].status).toBe('REFUNDED');
  expect(payments[0].amount).toBe(90);       // discounted amount
  expect(payments[0].originalAmount).toBe(100);
});`,
    'gap-3': `it('applies 10% discount to $99.99 and rounds to exactly $89.99', () => {
  const payment = paymentService.processPayment({
    orderId: 1, userId, amount: 99.99, discountCode: 'SAVE10',
  });
  expect(payment.amount).toBe(89.99);
  expect(payment.amount.toString()).not.toMatch(/\\.\\d{3,}/);
});`,
    'gap-4': `it('charges full price when discountCode is empty string', () => {
  cartService.addToCart(userId, productId, 1);
  const { order, payment } = orderService.placeOrder({ userId, discountCode: '' });
  expect(order.total).toBe(100);
  expect(payment.discountCode).toBeNull();
  expect(payment.discountPercent).toBe(0);
});`,
    'gap-5': `it('second order is not discounted after a discounted first order', () => {
  cartService.addToCart(userId, productId, 1);
  orderService.placeOrder({ userId, discountCode: 'SAVE10' });
  cartService.addToCart(userId, productId, 1);
  const { order } = orderService.placeOrder({ userId }); // no code
  expect(order.total).toBe(100);
  expect(order.discountCode).toBeNull();
});`,
    'gap-6': `it('cart items remain after a failed payment', () => {
  cartService.addToCart(userId, productId, 2);
  orderService.placeOrder({ userId, simulatePaymentFailure: true });
  const cart = cartService.getCart(userId);
  expect(cart.items).toHaveLength(1);
  expect(cart.items[0].quantity).toBe(2);
});`,
    'gap-7': `it('stock is restored when a confirmed order is cancelled', () => {
  // Arrange: 10 in stock, place order for 3
  cartService.addToCart(userId, productId, 3);
  const { order } = orderService.placeOrder({ userId });
  expect(productService.getProductById(productId).stock).toBe(7);

  // Act: cancel the order
  orderService.cancelOrder(order.id);

  // Assert: stock must be returned
  expect(productService.getProductById(productId).stock).toBe(10);
});`,
  };
  return stubs[gap.id] || `// Test stub for: ${gap.title}`;
}

module.exports = { generateRegressionTests, getValidationResults };
