const { db } = require('../../config/database');
const productService = require('../products/productService');

/**
 * Get or create the cart for a user.
 *
 * @param {number} userId
 * @returns {object} { userId, items: [{ productId, quantity, price, name }] }
 */
function getCart(userId) {
  if (!db.carts[userId]) {
    db.carts[userId] = { userId, items: [] };
  }
  return db.carts[userId];
}

/**
 * Add an item to the user's cart or increase quantity if already present.
 *
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity
 * @returns {object} Updated cart
 */
function addToCart(userId, productId, quantity = 1) {
  if (quantity < 1) throw new Error('quantity must be >= 1');

  const product = productService.getProductById(productId);
  if (!product) throw new Error(`Product ${productId} not found`);
  if (product.stock < quantity) throw new Error(`Insufficient stock for product ${productId}`);

  const cart = getCart(userId);
  const existing = cart.items.find((i) => i.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price: product.price, name: product.name });
  }

  return cart;
}

/**
 * Remove an item from the cart entirely.
 *
 * @param {number} userId
 * @param {number} productId
 * @returns {object} Updated cart
 */
function removeFromCart(userId, productId) {
  const cart = getCart(userId);
  cart.items = cart.items.filter((i) => i.productId !== productId);
  return cart;
}

/**
 * Update the quantity of a specific cart item.
 * Setting quantity to 0 removes the item.
 *
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity
 * @returns {object} Updated cart
 */
function updateCartItem(userId, productId, quantity) {
  if (quantity < 0) throw new Error('quantity must be >= 0');

  if (quantity === 0) return removeFromCart(userId, productId);

  const cart = getCart(userId);
  const item = cart.items.find((i) => i.productId === productId);
  if (!item) throw new Error(`Product ${productId} not in cart`);

  item.quantity = quantity;
  return cart;
}

/**
 * Clear all items from a user's cart (called after order placement).
 *
 * @param {number} userId
 */
function clearCart(userId) {
  db.carts[userId] = { userId, items: [] };
}

/**
 * Calculate the total value of the cart.
 *
 * @param {number} userId
 * @returns {number}
 */
function getCartTotal(userId) {
  const cart = getCart(userId);
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getCartTotal,
};
