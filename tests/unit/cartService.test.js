const { resetDb } = require('../../src/config/database');
const productService = require('../../src/modules/products/productService');
const cartService = require('../../src/modules/cart/cartService');

beforeEach(() => {
  resetDb();
  productService._resetIdCounter();

  // Seed a product for each test
  productService.createProduct({ name: 'Widget', price: 10, stock: 50 });
  productService.createProduct({ name: 'Gadget', price: 25, stock: 10 });
});

const USER_ID = 42;

describe('cartService', () => {
  describe('getCart', () => {
    it('returns an empty cart for a new user', () => {
      const cart = cartService.getCart(USER_ID);
      expect(cart).toEqual({ userId: USER_ID, items: [] });
    });
  });

  describe('addToCart', () => {
    it('adds a new item to the cart', () => {
      cartService.addToCart(USER_ID, 1, 2);
      const cart = cartService.getCart(USER_ID);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toMatchObject({ productId: 1, quantity: 2, price: 10 });
    });

    it('increments quantity when the same product is added again', () => {
      cartService.addToCart(USER_ID, 1, 1);
      cartService.addToCart(USER_ID, 1, 3);
      const cart = cartService.getCart(USER_ID);
      expect(cart.items[0].quantity).toBe(4);
    });

    it('throws for unknown product', () => {
      expect(() => cartService.addToCart(USER_ID, 999, 1)).toThrow(/not found/);
    });

    it('throws when quantity exceeds stock', () => {
      expect(() => cartService.addToCart(USER_ID, 1, 100)).toThrow(/Insufficient stock/);
    });

    it('throws for quantity < 1', () => {
      expect(() => cartService.addToCart(USER_ID, 1, 0)).toThrow(/quantity/);
    });
  });

  describe('removeFromCart', () => {
    it('removes the item from the cart', () => {
      cartService.addToCart(USER_ID, 1, 1);
      cartService.removeFromCart(USER_ID, 1);
      expect(cartService.getCart(USER_ID).items).toHaveLength(0);
    });
  });

  describe('updateCartItem', () => {
    it('updates the item quantity', () => {
      cartService.addToCart(USER_ID, 1, 1);
      cartService.updateCartItem(USER_ID, 1, 5);
      expect(cartService.getCart(USER_ID).items[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
      cartService.addToCart(USER_ID, 1, 2);
      cartService.updateCartItem(USER_ID, 1, 0);
      expect(cartService.getCart(USER_ID).items).toHaveLength(0);
    });

    it('throws if item is not in cart', () => {
      expect(() => cartService.updateCartItem(USER_ID, 1, 3)).toThrow(/not in cart/);
    });
  });

  describe('getCartTotal', () => {
    it('calculates the correct total', () => {
      cartService.addToCart(USER_ID, 1, 2); // 2 × $10 = $20
      cartService.addToCart(USER_ID, 2, 1); // 1 × $25 = $25
      expect(cartService.getCartTotal(USER_ID)).toBe(45);
    });

    it('returns 0 for an empty cart', () => {
      expect(cartService.getCartTotal(USER_ID)).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('empties the cart', () => {
      cartService.addToCart(USER_ID, 1, 3);
      cartService.clearCart(USER_ID);
      expect(cartService.getCart(USER_ID).items).toHaveLength(0);
    });
  });
});
