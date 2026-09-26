const { resetDb } = require('../../src/config/database');
const productService = require('../../src/modules/products/productService');

beforeEach(() => {
  resetDb();
  productService._resetIdCounter();
});

describe('productService', () => {
  describe('createProduct', () => {
    it('creates and returns a product', () => {
      const p = productService.createProduct({
        name: 'Widget',
        price: 9.99,
        stock: 100,
        category: 'tools',
      });

      expect(p).toMatchObject({ id: 1, name: 'Widget', price: 9.99, stock: 100 });
    });

    it('throws for missing name or price', () => {
      expect(() => productService.createProduct({ price: 5 })).toThrow(/required/);
      expect(() => productService.createProduct({ name: 'X' })).toThrow(/required/);
    });

    it('throws for negative price or stock', () => {
      expect(() => productService.createProduct({ name: 'X', price: -1 })).toThrow(/price/);
      expect(() => productService.createProduct({ name: 'X', price: 0, stock: -1 })).toThrow(
        /stock/
      );
    });
  });

  describe('getProductById', () => {
    it('returns the product', () => {
      const p = productService.createProduct({ name: 'A', price: 1 });
      expect(productService.getProductById(p.id)).toMatchObject({ id: p.id });
    });

    it('returns null for unknown id', () => {
      expect(productService.getProductById(999)).toBeNull();
    });
  });

  describe('listProducts', () => {
    it('returns all products', () => {
      productService.createProduct({ name: 'A', price: 1, category: 'x' });
      productService.createProduct({ name: 'B', price: 2, category: 'y' });
      expect(productService.listProducts()).toHaveLength(2);
    });

    it('filters by category', () => {
      productService.createProduct({ name: 'A', price: 1, category: 'x' });
      productService.createProduct({ name: 'B', price: 2, category: 'y' });
      expect(productService.listProducts('x')).toHaveLength(1);
      expect(productService.listProducts('x')[0].name).toBe('A');
    });
  });

  describe('updateProduct', () => {
    it('updates product fields', () => {
      const p = productService.createProduct({ name: 'A', price: 1 });
      const updated = productService.updateProduct(p.id, { price: 5, stock: 50 });
      expect(updated.price).toBe(5);
      expect(updated.stock).toBe(50);
    });

    it('throws for unknown product', () => {
      expect(() => productService.updateProduct(999, {})).toThrow(/not found/);
    });
  });

  describe('decrementStock', () => {
    it('reduces stock by the given quantity', () => {
      const p = productService.createProduct({ name: 'A', price: 1, stock: 10 });
      const updated = productService.decrementStock(p.id, 3);
      expect(updated.stock).toBe(7);
    });

    it('throws when stock is insufficient', () => {
      const p = productService.createProduct({ name: 'A', price: 1, stock: 2 });
      expect(() => productService.decrementStock(p.id, 5)).toThrow(/Insufficient stock/);
    });
  });
});
