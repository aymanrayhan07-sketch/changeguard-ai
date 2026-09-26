const { db } = require('../../config/database');
const { PAYMENT_STATUS, DISCOUNT_CODES } = require('../../config/constants');

let nextId = 1;

/**
 * Process a payment for an order.
 * For the demo, payments with amounts > 0 always succeed
 * unless `simulateFailure` is set to true.
 *
 * When a valid `discountCode` is supplied the charged amount is reduced by the
 * code's discount percentage (e.g. 10% off).  The original pre-discount amount
 * and the code used are recorded on the payment record for auditability.
 *
 * @param {object} data - { orderId, userId, amount, method, discountCode, simulateFailure }
 * @returns {object} Payment record
 */
function processPayment({
  orderId,
  userId,
  amount,
  method = 'card',
  discountCode = null,
  simulateFailure = false,
}) {
  if (!orderId || !userId || amount === undefined) {
    throw new Error('orderId, userId and amount are required');
  }
  if (amount <= 0) throw new Error('amount must be > 0');

  // Resolve discount
  let finalAmount = amount;
  let discountPercent = 0;

  if (discountCode) {
    discountPercent = DISCOUNT_CODES[discountCode];
    if (discountPercent === undefined) {
      throw new Error(`Invalid discount code: ${discountCode}`);
    }
    finalAmount = parseFloat((amount * (1 - discountPercent / 100)).toFixed(2));
  }

  const status = simulateFailure ? PAYMENT_STATUS.FAILED : PAYMENT_STATUS.SUCCESS;

  const payment = {
    id: nextId++,
    orderId,
    userId,
    amount: finalAmount,
    originalAmount: amount,
    discountCode: discountCode || null,
    discountPercent,
    method,
    status,
    processedAt: new Date().toISOString(),
  };

  db.payments.push(payment);
  return payment;
}

/**
 * Refund a payment by id.
 *
 * @param {number} paymentId
 * @returns {object} Updated payment
 */
function refundPayment(paymentId) {
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new Error(`Payment ${paymentId} not found`);
  if (payment.status !== PAYMENT_STATUS.SUCCESS) {
    throw new Error(`Cannot refund payment with status ${payment.status}`);
  }

  payment.status = PAYMENT_STATUS.REFUNDED;
  payment.refundedAt = new Date().toISOString();
  return payment;
}

/**
 * Get a payment by id.
 *
 * @param {number} id
 * @returns {object|null}
 */
function getPaymentById(id) {
  return db.payments.find((p) => p.id === id) || null;
}

/**
 * Get all payments for an order.
 *
 * @param {number} orderId
 * @returns {object[]}
 */
function getPaymentsByOrder(orderId) {
  return db.payments.filter((p) => p.orderId === orderId);
}

/**
 * Reset internal id counter — intended for use in tests only.
 */
function _resetIdCounter() {
  nextId = 1;
}

module.exports = {
  processPayment,
  refundPayment,
  getPaymentById,
  getPaymentsByOrder,
  _resetIdCounter,
};
