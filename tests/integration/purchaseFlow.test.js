/**
 * End-to-end integration test: full purchase flow
 *
 * Alice registers → browses products → adds items to cart → places order →
 * payment succeeds → receives notification → admin ships the order → Alice is notified.
 */

const { resetDb } = require('../../src/config/database');
const authService = require('../../src/modules/auth/authService');
const productService = require('../../src/modules/products/productService');
const cartService = require('../../src/modules/cart/cartService');
const orderService = require('../../src/modules/orders/orderService');
const notificationService = require('../../src/modules/notifications/notificationService');
const paymentService = require('../../src/modules/payments/paymentService');
const userService = require('../../src/modules/users/userService');

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

describe('Full purchase flow', () => {
  it('completes the full e-commerce purchase lifecycle', () => {
    // 1. Register
    const { user, token } = authService.register({
      name: 'Alice',
      email: 'alice@shop.com',
      password: 'supersecret',
    });
    expect(token).toBeDefined();

    // 2. Seed catalog
    const laptop = productService.createProduct({
      name: 'Laptop Pro',
      price: 1200,
      stock: 5,
      category: 'electronics',
    });
    const bag = productService.createProduct({
      name: 'Laptop Bag',
      price: 50,
      stock: 20,
      category: 'accessories',
    });

    // 3. Build cart
    cartService.addToCart(user.id, laptop.id, 1);
    cartService.addToCart(user.id, bag.id, 2);
    expect(cartService.getCartTotal(user.id)).toBe(1300); // 1200 + 100

    // 4. Place order (no discount)
    const { order, payment } = orderService.placeOrder({ userId: user.id });
    expect(order.status).toBe('CONFIRMED');
    expect(payment.status).toBe('SUCCESS');
    expect(order.cartTotal).toBe(1300);
    expect(order.total).toBe(1300);        // no discount code — equals cartTotal

    // 5. Cart should be cleared
    expect(cartService.getCart(user.id).items).toHaveLength(0);

    // 6. Stock decremented
    expect(productService.getProductById(laptop.id).stock).toBe(4);
    expect(productService.getProductById(bag.id).stock).toBe(18);

    // 7. Notification sent with actual (non-discounted) total
    const notifications = notificationService.getNotificationsForUser(user.id);
    const confirmed = notifications.find((n) => n.type === 'ORDER_CONFIRMED');
    expect(confirmed).toBeDefined();
    expect(confirmed.payload.total).toBe(1300); // no discount — still 1300

    // 8. Admin ships the order
    orderService.updateOrderStatus(order.id, 'SHIPPED');

    const afterShip = notificationService.getNotificationsForUser(user.id);
    const shipped = afterShip.find((n) => n.type === 'ORDER_SHIPPED');
    expect(shipped).toBeDefined();
  });

  it('handles a failed payment gracefully', () => {
    const { user } = authService.register({
      name: 'Bob',
      email: 'bob@shop.com',
      password: 'pw',
    });
    productService.createProduct({ name: 'Widget', price: 10, stock: 5 });
    cartService.addToCart(user.id, 1, 1);

    const { order, payment } = orderService.placeOrder({
      userId: user.id,
      simulatePaymentFailure: true,
    });

    expect(order.status).toBe('CANCELLED');
    expect(payment.status).toBe('FAILED');

    const notifications = notificationService.getNotificationsForUser(user.id);
    expect(notifications.some((n) => n.type === 'PAYMENT_FAILED')).toBe(true);
  });

  it('applies discount code through the full purchase flow', () => {
    const { user } = authService.register({
      name: 'Carol',
      email: 'carol@shop.com',
      password: 'pw',
    });

    productService.createProduct({ name: 'Headphones', price: 200, stock: 10 });
    cartService.addToCart(user.id, 1, 1); // cartTotal = 200

    const { order, payment } = orderService.placeOrder({
      userId: user.id,
      discountCode: 'WELCOME10',
    });

    // Order total reflects the discount
    expect(order.cartTotal).toBe(200);
    expect(order.total).toBe(180);         // 200 * 0.9
    expect(order.discountCode).toBe('WELCOME10');

    // Payment amount matches the discounted total
    expect(payment.amount).toBe(180);
    expect(payment.originalAmount).toBe(200);
    expect(payment.discountCode).toBe('WELCOME10');

    // Notification carries the discounted total
    const notifications = notificationService.getNotificationsForUser(user.id);
    const confirmed = notifications.find((n) => n.type === 'ORDER_CONFIRMED');
    expect(confirmed.payload.total).toBe(180);

    // Cart cleared
    expect(cartService.getCart(user.id).items).toHaveLength(0);
  });
});
