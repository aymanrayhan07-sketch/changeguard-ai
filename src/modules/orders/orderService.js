const { db } = require('../../config/database');
const { ORDER_STATUS } = require('../../config/constants');
const cartService = require('../cart/cartService');
const productService = require('../products/productService');
const paymentService = require('../payments/paymentService');
const notificationService = require('../notifications/notificationService');

let nextId = 1;

/**
 * Place a new order from the user's current cart.
 * Steps:
 *  1. Validate cart is not empty
 *  2. Decrement product stock
 *  3. Process payment (applying discount if a valid code is provided)
 *  4a. On SUCCESS — clear cart, confirm order, notify user
 *  4b. On FAILURE  — restore decremented stock, cancel order, notify user
 *
 * When a `discountCode` is supplied and valid, the order total and the charged
 * payment amount both reflect the discounted price (10% off for supported codes).
 *
 * @param {object} data - { userId, paymentMethod, discountCode, simulatePaymentFailure }
 * @returns {{ order: object, payment: object }}
 */
function placeOrder({
  userId,
  paymentMethod = 'card',
  discountCode = null,
  simulatePaymentFailure = false,
}) {
  const cart = cartService.getCart(userId);
  if (!cart.items.length) throw new Error('Cart is empty');

  const cartTotal = cartService.getCartTotal(userId);

  // Snapshot items and decrement stock
  const items = cart.items.map((item) => {
    productService.decrementStock(item.productId, item.quantity);
    return { ...item };
  });

  // Process payment first — this validates the discount code and returns
  // the final (possibly discounted) amount before we persist the order total.
  const payment = paymentService.processPayment({
    orderId: nextId,        // peek at the id we are about to assign
    userId,
    amount: cartTotal,
    method: paymentMethod,
    discountCode,
    simulateFailure: simulatePaymentFailure,
  });

  // Create the order record using the amount actually charged.
  const order = {
    id: nextId++,
    userId,
    items,
    cartTotal,
    total: payment.amount,   // discounted amount (equals cartTotal when no code used)
    discountCode: discountCode || null,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.orders.push(order);

  if (payment.status === 'SUCCESS') {
    order.status = ORDER_STATUS.CONFIRMED;
    order.updatedAt = new Date().toISOString();
    cartService.clearCart(userId);
    notificationService.sendNotification(userId, 'ORDER_CONFIRMED', {
      orderId: order.id,
      total: order.total,
    });
  } else {
    order.status = ORDER_STATUS.CANCELLED;
    order.updatedAt = new Date().toISOString();

    // Restore stock for every item that was decremented before the payment attempt.
    // The cart is intentionally left intact so the user can correct and retry.
    items.forEach((item) => {
      const product = productService.getProductById(item.productId);
      productService.updateProduct(item.productId, { stock: product.stock + item.quantity });
    });

    notificationService.sendNotification(userId, 'PAYMENT_FAILED', {
      orderId: order.id,
    });
  }

  return { order, payment };
}

/**
 * Update the status of an existing order.
 *
 * @param {number} orderId
 * @param {string} status - One of ORDER_STATUS values
 * @returns {object} Updated order
 */
function updateOrderStatus(orderId, status) {
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);

  const validStatuses = Object.values(ORDER_STATUS);
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  if (status === ORDER_STATUS.SHIPPED) {
    notificationService.sendNotification(order.userId, 'ORDER_SHIPPED', {
      orderId: order.id,
    });
  }

  return order;
}

/**
 * Get an order by id.
 *
 * @param {number} id
 * @returns {object|null}
 */
function getOrderById(id) {
  return db.orders.find((o) => o.id === id) || null;
}

/**
 * List all orders for a specific user.
 *
 * @param {number} userId
 * @returns {object[]}
 */
function getOrdersByUser(userId) {
  return db.orders.filter((o) => o.userId === userId);
}

/**
 * Cancel an order and trigger a refund if it was already paid.
 *
 * @param {number} orderId
 * @returns {object} Updated order
 */
function cancelOrder(orderId) {
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);

  if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.DELIVERED) {
    throw new Error('Cannot cancel a shipped or delivered order');
  }

  order.status = ORDER_STATUS.CANCELLED;
  order.updatedAt = new Date().toISOString();

  // Restore stock for every item that was decremented when the order was placed.
  order.items.forEach((item) => {
    const product = productService.getProductById(item.productId);
    productService.updateProduct(item.productId, { stock: product.stock + item.quantity });
  });

  // Refund any successful payment
  const payments = paymentService.getPaymentsByOrder(orderId);
  payments
    .filter((p) => p.status === 'SUCCESS')
    .forEach((p) => paymentService.refundPayment(p.id));

  return order;
}

/**
 * Reset internal id counter — intended for use in tests only.
 */
function _resetIdCounter() {
  nextId = 1;
}

module.exports = {
  placeOrder,
  updateOrderStatus,
  getOrderById,
  getOrdersByUser,
  cancelOrder,
  _resetIdCounter,
};
