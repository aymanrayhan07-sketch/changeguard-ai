/**
 * Valid discount codes and their percentage discount (0–100).
 * In a real system these would live in a database and support
 * expiry dates, per-user limits, etc.
 */
const DISCOUNT_CODES = {
  SAVE10: 10,
  WELCOME10: 10,
};

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'demo-secret-key',
  JWT_EXPIRES_IN: '24h',
  DISCOUNT_CODES,

  ORDER_STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
  },

  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
  },

  NOTIFICATION_TYPES: {
    ORDER_CONFIRMED: 'ORDER_CONFIRMED',
    ORDER_SHIPPED: 'ORDER_SHIPPED',
    PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    ACCOUNT_CREATED: 'ACCOUNT_CREATED',
  },
};
