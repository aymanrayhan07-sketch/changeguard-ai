/**
 * Regression tests for the discount-code feature (introduced in the
 * "10% discount on valid code" change).
 *
 * Six scenarios identified as missing after the change was implemented:
 *
 *  Gap 1 – Stock not restored when a discounted order's payment fails
 *  Gap 2 – Refund amount for a discounted order equals the discounted total
 *  Gap 3 – Floating-point precision for non-round prices
 *  Gap 4 – Empty-string discount code treated as no discount
 *  Gap 5 – Consecutive orders with different codes do not bleed into each other
 *  Gap 6 – Cart is preserved (not cleared) when payment fails
 */

const { resetDb } = require('../../src/config/database');
const userService = require('../../src/modules/users/userService');
const productService = require('../../src/modules/products/productService');
const cartService = require('../../src/modules/cart/cartService');
const orderService = require('../../src/modules/orders/orderService');
const paymentService = require('../../src/modules/payments/paymentService');
const notificationService = require('../../src/modules/notifications/notificationService');

function resetAllCounters() {
  userService._resetIdCounter();
  productService._resetIdCounter();
  orderService._resetIdCounter();
  paymentService._resetIdCounter();
  notificationService._resetIdCounter();
}

// ─── shared setup ────────────────────────────────────────────────────────────

let userId, productId;

beforeEach(() => {
  resetDb();
  resetAllCounters();

  const user = userService.createUser({ name: 'Alice', email: 'a@a.com', password: 'pw' });
  userId = user.id;

  const product = productService.createProduct({ name: 'Widget', price: 100, stock: 10 });
  productId = product.id;
});

// ─── Gap 1 ───────────────────────────────────────────────────────────────────
// Scenario: a discounted order is placed but the payment fails.
// Stock was decremented before processPayment is called.
// No restore logic exists in orderService.
// Expected correct behaviour: stock SHOULD be restored so the product is
// still available for the customer's next attempt.
// Current behaviour: stock is NOT restored — this is a defect.
describe('Gap 1 — stock not restored after failed-payment discounted order', () => {
  it('stock should be restored when a discounted payment fails', () => {
    cartService.addToCart(userId, productId, 3); // stock: 10 → 7 after decrement

    orderService.placeOrder({
      userId,
      discountCode: 'SAVE10',
      simulatePaymentFailure: true,
    });

    // The order is CANCELLED — the 3 units should be back in stock.
    // NOTE: this assertion is expected to FAIL against the current implementation
    // because orderService has no stock-restore logic on payment failure.
    const product = productService.getProductById(productId);
    expect(product.stock).toBe(10);
  });
});

// ─── Gap 2 ───────────────────────────────────────────────────────────────────
// Scenario: a confirmed discounted order is later cancelled.
// The refund should cover the discounted amount actually charged (not the
// original cart total).
describe('Gap 2 — refund amount equals the discounted total, not the cart total', () => {
  it('refunded payment.amount equals the discounted order total', () => {
    cartService.addToCart(userId, productId, 1); // cartTotal = 100

    const { order } = orderService.placeOrder({
      userId,
      discountCode: 'SAVE10', // 10% off → total = 90
    });

    expect(order.total).toBe(90); // precondition

    orderService.cancelOrder(order.id);

    const payments = paymentService.getPaymentsByOrder(order.id);
    expect(payments).toHaveLength(1);

    const refundedPayment = payments[0];
    // The refunded payment record should carry the discounted amount (90),
    // not the original cart total (100).
    expect(refundedPayment.status).toBe('REFUNDED');
    expect(refundedPayment.amount).toBe(90);   // discounted amount charged
    expect(refundedPayment.originalAmount).toBe(100); // original cart total preserved
  });
});

// ─── Gap 3 ───────────────────────────────────────────────────────────────────
// Scenario: product price is not a round number.
// 10% of $99.99 = $89.991 — floating-point arithmetic could produce $89.99100…
// The implementation uses parseFloat(…toFixed(2)) which should round correctly.
describe('Gap 3 — floating-point precision for non-round product prices', () => {
  it('applies 10% discount to $99.99 and rounds to exactly $89.99', () => {
    // Override the shared product with a non-round price
    productService.createProduct({ name: 'PrecisionWidget', price: 99.99, stock: 5 });
    const precisionProductId = 2; // second product created in this test

    cartService.addToCart(userId, precisionProductId, 1); // cartTotal = 99.99

    const payment = paymentService.processPayment({
      orderId: 99,
      userId,
      amount: 99.99,
      discountCode: 'SAVE10',
    });

    // Must be exactly 89.99, not 89.991 or 89.99099999...
    expect(payment.amount).toBe(89.99);
    expect(typeof payment.amount).toBe('number');
    // Ensure no extra decimal digits
    expect(payment.amount.toString()).not.toMatch(/\.\d{3,}/);
  });

  it('applies 10% discount to a price that would produce a 3-decimal intermediate result', () => {
    // $33.33 * 0.9 = 29.997 → (29.997).toFixed(2) = "30.00" → parseFloat = 30
    const payment = paymentService.processPayment({
      orderId: 99,
      userId,
      amount: 33.33,
      discountCode: 'SAVE10',
    });

    expect(payment.amount).toBe(30.00);
    expect(typeof payment.amount).toBe('number');
  });
});

// ─── Gap 4 ───────────────────────────────────────────────────────────────────
// Scenario: caller passes discountCode as an empty string ''.
// The implementation guards with `if (discountCode)` which treats '' as falsy.
// Expected: behaves identically to passing no code — full price, no discount.
describe('Gap 4 — empty-string discount code treated as no discount', () => {
  it('charges full price and records no discount when discountCode is ""', () => {
    cartService.addToCart(userId, productId, 1); // cartTotal = 100

    const { order, payment } = orderService.placeOrder({
      userId,
      discountCode: '',
    });

    expect(order.total).toBe(100);
    expect(order.discountCode).toBeNull();
    expect(payment.amount).toBe(100);
    expect(payment.discountCode).toBeNull();
    expect(payment.discountPercent).toBe(0);
  });

  it('processPayment with empty discountCode charges full price', () => {
    const payment = paymentService.processPayment({
      orderId: 1,
      userId,
      amount: 100,
      discountCode: '',
    });

    expect(payment.amount).toBe(100);
    expect(payment.discountCode).toBeNull();
    expect(payment.discountPercent).toBe(0);
  });
});

// ─── Gap 5 ───────────────────────────────────────────────────────────────────
// Scenario: user places two consecutive orders — one with a discount code,
// one without. The second order must not inherit the discount from the first.
describe('Gap 5 — consecutive orders with different codes do not bleed into each other', () => {
  it('second order (no code) is not discounted after a discounted first order', () => {
    // First order: with discount
    cartService.addToCart(userId, productId, 1);
    const { order: order1, payment: payment1 } = orderService.placeOrder({
      userId,
      discountCode: 'SAVE10',
    });

    expect(order1.total).toBe(90);
    expect(payment1.discountCode).toBe('SAVE10');

    // Second order: no discount code
    cartService.addToCart(userId, productId, 1);
    const { order: order2, payment: payment2 } = orderService.placeOrder({ userId });

    expect(order2.total).toBe(100);            // full price, no bleed
    expect(order2.discountCode).toBeNull();
    expect(payment2.amount).toBe(100);
    expect(payment2.discountCode).toBeNull();
    expect(payment2.discountPercent).toBe(0);
  });

  it('second order (different code) applies only its own discount', () => {
    cartService.addToCart(userId, productId, 1);
    orderService.placeOrder({ userId, discountCode: 'SAVE10' });

    cartService.addToCart(userId, productId, 1);
    const { order, payment } = orderService.placeOrder({ userId, discountCode: 'WELCOME10' });

    // Both SAVE10 and WELCOME10 are 10%, so total = 90. The important thing
    // is the code recorded is WELCOME10, not SAVE10.
    expect(order.total).toBe(90);
    expect(order.discountCode).toBe('WELCOME10');
    expect(payment.discountCode).toBe('WELCOME10');
  });
});

// ─── Gap 6 ───────────────────────────────────────────────────────────────────
// Scenario: payment fails on an order (with or without a discount code).
// The cart should NOT be cleared — the user must be able to retry.
describe('Gap 6 — cart is preserved (not cleared) when payment fails', () => {
  it('cart items remain after a failed payment (no discount)', () => {
    cartService.addToCart(userId, productId, 2);

    orderService.placeOrder({ userId, simulatePaymentFailure: true });

    const cart = cartService.getCart(userId);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  it('cart items remain after a failed payment with a discount code', () => {
    cartService.addToCart(userId, productId, 1);

    orderService.placeOrder({
      userId,
      discountCode: 'SAVE10',
      simulatePaymentFailure: true,
    });

    const cart = cartService.getCart(userId);
    expect(cart.items).toHaveLength(1);
  });
});
