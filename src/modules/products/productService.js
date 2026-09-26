const { db } = require('../../config/database');

let nextId = 1;

/**
 * Add a new product to the catalog.
 *
 * @param {object} data - { name, description, price, stock, category }
 * @returns {object} Created product
 */
function createProduct({ name, description = '', price, stock = 0, category = 'general' }) {
  if (!name || price === undefined) {
    throw new Error('name and price are required');
  }
  if (price < 0) throw new Error('price must be >= 0');
  if (stock < 0) throw new Error('stock must be >= 0');

  const product = {
    id: nextId++,
    name,
    description,
    price,
    stock,
    category,
    createdAt: new Date().toISOString(),
  };

  db.products.push(product);
  return product;
}

/**
 * Retrieve a product by id.
 *
 * @param {number} id
 * @returns {object|null}
 */
function getProductById(id) {
  return db.products.find((p) => p.id === id) || null;
}

/**
 * List all products, optionally filtered by category.
 *
 * @param {string} [category]
 * @returns {object[]}
 */
function listProducts(category) {
  if (category) return db.products.filter((p) => p.category === category);
  return [...db.products];
}

/**
 * Update product fields.
 *
 * @param {number} id
 * @param {object} updates - Partial { name, description, price, stock, category }
 * @returns {object} Updated product
 */
function updateProduct(id, updates) {
  const product = db.products.find((p) => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);

  Object.assign(product, updates);
  return product;
}

/**
 * Decrement stock after a purchase.
 * Throws if insufficient stock.
 *
 * @param {number} id
 * @param {number} quantity
 * @returns {object} Updated product
 */
function decrementStock(id, quantity) {
  const product = db.products.find((p) => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for product ${id}`);
  }

  product.stock -= quantity;
  return product;
}

/**
 * Reset internal id counter — intended for use in tests only.
 */
function _resetIdCounter() {
  nextId = 1;
}

module.exports = {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  decrementStock,
  _resetIdCounter,
};
