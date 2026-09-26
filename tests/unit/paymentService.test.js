const { resetDb } = require('../../src/config/database');
const paymentService = require('../../src/modules/payments/paymentService');

beforeEach(() => {
  resetDb();
  paymentService._resetIdCounter();
});

describe('paymentService', () => {
  describe('processPayment', () => {
    it('creates a successful payment record with no discount', () => {
      const payment = paymentService.processPayment({
        orderId: 1,
        userId: 10,
        amount: 99.99,
        method: 'card',
      });

      expect(payment).toMatchObject({
        id: 1,
        orderId: 1,
        userId: 10,
        amount: 99.99,
        originalAmount: 99.99,
        discountCode: null,
        discountPercent: 0,
        status: 'SUCCESS',
      });
    });

    it('applies a 10% discount for a valid discount code', () => {
      const payment = paymentService.processPayment({
        orderId: 1,
        userId: 10,
        amount: 100,
        discountCode: 'SAVE10',
      });

      expect(payment.amount).toBe(90);
      expect(payment.originalAmount).toBe(100);
      expect(payment.discountCode).toBe('SAVE10');
      expect(payment.discountPercent).toBe(10);
      expect(payment.status).toBe('SUCCESS');
    });

    it('applies a 10% discount for the WELCOME10 code', () => {
      const payment = paymentService.processPayment({
        orderId: 1,
        userId: 10,
        amount: 200,
        discountCode: 'WELCOME10',
      });

      expect(payment.amount).toBe(180);
      expect(payment.discountPercent).toBe(10);
    });

    it('throws for an invalid discount code', () => {
      expect(() =>
        paymentService.processPayment({
          orderId: 1,
          userId: 10,
          amount: 50,
          discountCode: 'BOGUS',
        })
      ).toThrow(/Invalid discount code/);
    });

    it('ignores discount when no code is provided (null)', () => {
      const payment = paymentService.processPayment({
        orderId: 1,
        userId: 10,
        amount: 50,
        discountCode: null,
      });
      expect(payment.amount).toBe(50);
      expect(payment.discountPercent).toBe(0);
    });

    it('creates a failed payment when simulateFailure is true', () => {
      const payment = paymentService.processPayment({
        orderId: 1,
        userId: 10,
        amount: 50,
        simulateFailure: true,
      });

      expect(payment.status).toBe('FAILED');
    });

    it('throws for missing required fields', () => {
      expect(() => paymentService.processPayment({ userId: 1, amount: 10 })).toThrow(/required/);
    });

    it('throws for amount <= 0', () => {
      expect(() =>
        paymentService.processPayment({ orderId: 1, userId: 1, amount: 0 })
      ).toThrow(/amount must be > 0/);
    });
  });

  describe('refundPayment', () => {
    it('refunds a successful payment', () => {
      const payment = paymentService.processPayment({ orderId: 1, userId: 1, amount: 20 });
      const refunded = paymentService.refundPayment(payment.id);
      expect(refunded.status).toBe('REFUNDED');
      expect(refunded.refundedAt).toBeDefined();
    });

    it('throws when trying to refund a failed payment', () => {
      const payment = paymentService.processPayment({
        orderId: 1,
        userId: 1,
        amount: 20,
        simulateFailure: true,
      });
      expect(() => paymentService.refundPayment(payment.id)).toThrow(/Cannot refund/);
    });

    it('throws for unknown payment id', () => {
      expect(() => paymentService.refundPayment(999)).toThrow(/not found/);
    });
  });

  describe('getPaymentsByOrder', () => {
    it('returns all payments for an order', () => {
      paymentService.processPayment({ orderId: 5, userId: 1, amount: 10 });
      paymentService.processPayment({ orderId: 5, userId: 1, amount: 15 });
      paymentService.processPayment({ orderId: 9, userId: 1, amount: 20 });

      const payments = paymentService.getPaymentsByOrder(5);
      expect(payments).toHaveLength(2);
    });
  });
});
