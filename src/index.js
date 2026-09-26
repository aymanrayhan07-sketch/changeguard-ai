/**
 * Application entry point.
 *
 * This file wires together all modules and exposes a simple
 * programmatic API surface.  In a real application this would
 * bootstrap an Express / Fastify HTTP server; here it simply
 * exports the services so they can be consumed or demoed.
 */

const authService = require('./modules/auth/authService');
const userService = require('./modules/users/userService');
const productService = require('./modules/products/productService');
const cartService = require('./modules/cart/cartService');
const orderService = require('./modules/orders/orderService');
const paymentService = require('./modules/payments/paymentService');
const notificationService = require('./modules/notifications/notificationService');

module.exports = {
  authService,
  userService,
  productService,
  cartService,
  orderService,
  paymentService,
  notificationService,
};

// Quick smoke test when run directly: node src/index.js
if (require.main === module) {
  const { db, resetDb } = require('./config/database');

  resetDb();

  console.log('=== E-Commerce Demo Backend ===\n');

  // Register a user
  const { user, token } = authService.register({
    name: 'Demo User',
    email: 'demo@shop.com',
    password: 'demo1234',
  });
  console.log('Registered:', user.name, '| token preview:', token.slice(0, 30) + '...');

  // Create products
  const p1 = productService.createProduct({ name: 'Keyboard', price: 75, stock: 20 });
  const p2 = productService.createProduct({ name: 'Mouse', price: 35, stock: 15 });
  console.log('Products created:', p1.name, ',', p2.name);

  // Build cart & place order
  cartService.addToCart(user.id, p1.id, 1);
  cartService.addToCart(user.id, p2.id, 2);
  console.log('Cart total: $' + cartService.getCartTotal(user.id));

  const { order, payment } = orderService.placeOrder({ userId: user.id });
  console.log(`Order #${order.id} status: ${order.status} | Payment: ${payment.status}`);

  // Notifications
  const notifications = notificationService.getNotificationsForUser(user.id);
  console.log('Notifications:', notifications.map((n) => n.type).join(', '));
}
