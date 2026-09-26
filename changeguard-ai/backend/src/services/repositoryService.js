/**
 * repositoryService.js
 *
 * Responsible for reading and understanding the target repository structure.
 *
 * Current implementation returns static metadata about the change-impact-demo
 * repository (our controlled demo target).
 *
 * ── IBM Bob integration point ────────────────────────────────────────────────
 * Replace getRepositoryContext() with a real file-system walker (or a Bob
 * tool call) that reads the actual repo at REPO_PATH, extracts module names,
 * import graphs, and test file paths.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const REPO_NAME = 'change-impact-demo';

/**
 * Returns a structured description of the target repository.
 * @returns {object} Repository context object
 */
function getRepositoryContext() {
  return {
    name: REPO_NAME,
    // ── Bob hook: replace with real path scan ──────────────────────────────
    modules: [
      { name: 'users',         path: 'src/modules/users/userService.js',           hasTests: true },
      { name: 'auth',          path: 'src/modules/auth/authService.js',            hasTests: true },
      { name: 'products',      path: 'src/modules/products/productService.js',     hasTests: true },
      { name: 'cart',          path: 'src/modules/cart/cartService.js',            hasTests: true },
      { name: 'payments',      path: 'src/modules/payments/paymentService.js',     hasTests: true },
      { name: 'orders',        path: 'src/modules/orders/orderService.js',         hasTests: true },
      { name: 'notifications', path: 'src/modules/notifications/notificationService.js', hasTests: true },
    ],
    testFiles: [
      'tests/unit/userService.test.js',
      'tests/unit/authService.test.js',
      'tests/unit/productService.test.js',
      'tests/unit/cartService.test.js',
      'tests/unit/paymentService.test.js',
      'tests/unit/notificationService.test.js',
      'tests/unit/orderService.test.js',
      'tests/integration/purchaseFlow.test.js',
      'tests/regression/discountRegressions.test.js',
    ],
    configFiles: [
      'src/config/constants.js',
      'src/config/database.js',
    ],
  };
}

module.exports = { getRepositoryContext };
