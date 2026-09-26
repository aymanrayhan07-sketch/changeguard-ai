/**
 * In-memory database simulation for the demo project.
 * In a real application this would be a connection pool (e.g. pg, mongoose).
 */

const db = {
  users: [],
  products: [],
  carts: {},      // keyed by userId
  orders: [],
  payments: [],
  notifications: [],
};

/**
 * Reset all collections — used between tests.
 */
function resetDb() {
  db.users = [];
  db.products = [];
  db.carts = {};
  db.orders = [];
  db.payments = [];
  db.notifications = [];
}

module.exports = { db, resetDb };
