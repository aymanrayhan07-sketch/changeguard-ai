const { resetDb } = require('../../src/config/database');
const productService = require('../../src/modules/products/productService');
const userService = require('../../src/modules/users/userService');
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

beforeEach(() => {
  resetDb();
  resetAllCounters();
});

describe('orderService', () => {
  let userId, productId;

  beforeEach(() => {
    const user = userService.createUser({ name: 'Alice', email: 'a@a.com', password: 'pw' });
    userId = user.id;

    const product = productService.createProduct({ name: 'Widget', price: 20, stock: 10 });
    productId = product.id;
  });

  describe('placeOrder', () => {
    it('places a confirmed order and decrements stock', () => {
      cartService.addToCart(userId, productId, 2);
      const { order, payment } = orderService.placeOrder({ userId });

      expect(order.status).toBe('CONFIRMED');
      expect(order.cartTotal).toBe(40);
      expect(order.total).toBe(40);        // no discount — total equals cartTotal
      expect(order.discountCode).toBeNull();
      expect(payment.status).toBe('SUCCESS');
      expect(payment.amount).toBe(40);
      expect(payment.discountCode).toBeNull();
      expect(payment.discountPercent).toBe(0);

      // Stock decremented
      const product = productService.getProductById(productId);
      expect(product.stock).toBe(8);
    });

    it('applies a 10% discount when a valid discount code is provided', () => {
      cartService.addToCart(userId, productId, 2); // cartTotal = 40
      const { order, payment } = orderService.placeOrder({
        userId,
        discountCode: 'SAVE10',
      });

      expect(order.status).toBe('CONFIRMED');
      expect(order.cartTotal).toBe(40);
      expect(order.total).toBe(36);        // 40 * 0.9
      expect(order.discountCode).toBe('SAVE10');

      expect(payment.amount).toBe(36);
      expect(payment.originalAmount).toBe(40);
      expect(payment.discountCode).toBe('SAVE10');
      expect(payment.discountPercent).toBe(10);
    });

    it('throws when an invalid discount code is supplied', () => {
      cartService.addToCart(userId, productId, 1);
      expect(() =>
        orderService.placeOrder({ userId, discountCode: 'FAKE99' })
      ).toThrow(/Invalid discount code/);
    });

    it('clears the cart after a successful order', () => {
      cartService.addToCart(userId, productId, 1);
      orderService.placeOrder({ userId });

      expect(cartService.getCart(userId).items).toHaveLength(0);
    });

    it('sends an ORDER_CONFIRMED notification', () => {
      cartService.addToCart(userId, productId, 1);
      orderService.placeOrder({ userId });

      const notifications = notificationService.getNotificationsForUser(userId);
      expect(notifications.some((n) => n.type === 'ORDER_CONFIRMED')).toBe(true);
    });

    it('cancels the order and sends PAYMENT_FAILED when payment fails', () => {
      cartService.addToCart(userId, productId, 1);
      const { order, payment } = orderService.placeOrder({
        userId,
        simulatePaymentFailure: true,
      });

      expect(order.status).toBe('CANCELLED');
      expect(payment.status).toBe('FAILED');

      const notifications = notificationService.getNotificationsForUser(userId);
      expect(notifications.some((n) => n.type === 'PAYMENT_FAILED')).toBe(true);
    });

    it('throws when cart is empty', () => {
      expect(() => orderService.placeOrder({ userId })).toThrow(/Cart is empty/);
    });
  });

  describe('updateOrderStatus', () => {
    it('updates status to SHIPPED and sends a notification', () => {
      cartService.addToCart(userId, productId, 1);
      const { order } = orderService.placeOrder({ userId });

      const updated = orderService.updateOrderStatus(order.id, 'SHIPPED');
      expect(updated.status).toBe('SHIPPED');

      const notifications = notificationService.getNotificationsForUser(userId);
      expect(notifications.some((n) => n.type === 'ORDER_SHIPPED')).toBe(true);
    });

    it('throws for an invalid status', () => {
      cartService.addToCart(userId, productId, 1);
      const { order } = orderService.placeOrder({ userId });
      expect(() => orderService.updateOrderStatus(order.id, 'FLYING')).toThrow(/Invalid status/);
    });
  });

  describe('cancelOrder', () => {
    it('cancels a confirmed order and triggers a refund', () => {
      cartService.addToCart(userId, productId, 1);
      const { order } = orderService.placeOrder({ userId });

      const cancelled = orderService.cancelOrder(order.id);
      expect(cancelled.status).toBe('CANCELLED');

      const payments = paymentService.getPaymentsByOrder(order.id);
      expect(payments[0].status).toBe('REFUNDED');
    });

    it('throws when cancelling a shipped order', () => {
      cartService.addToCart(userId, productId, 1);
      const { order } = orderService.placeOrder({ userId });
      orderService.updateOrderStatus(order.id, 'SHIPPED');

      expect(() => orderService.cancelOrder(order.id)).toThrow(/Cannot cancel/);
    });
  });

  describe('getOrdersByUser', () => {
    it('returns all orders for a user', () => {
      cartService.addToCart(userId, productId, 1);
      orderService.placeOrder({ userId });

      cartService.addToCart(userId, productId, 1);
      orderService.placeOrder({ userId });

      expect(orderService.getOrdersByUser(userId)).toHaveLength(2);
    });
  });
});
