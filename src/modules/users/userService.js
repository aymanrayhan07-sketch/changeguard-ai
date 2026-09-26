const bcrypt = require('bcryptjs');
const { db } = require('../../config/database');

let nextId = 1;

/**
 * Create a new user account.
 * Passwords are hashed with bcrypt before storage.
 *
 * @param {object} data - { name, email, password }
 * @returns {object} The created user (without password)
 */
function createUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('name, email and password are required');
  }

  const existing = db.users.find((u) => u.email === email);
  if (existing) {
    throw new Error(`User with email ${email} already exists`);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = {
    id: nextId++,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);

  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

/**
 * Retrieve a user by id.
 *
 * @param {number} id
 * @returns {object|null}
 */
function getUserById(id) {
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;

  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

/**
 * Retrieve a user by email (includes hashed password for auth use).
 *
 * @param {string} email
 * @returns {object|null}
 */
function getUserByEmail(email) {
  return db.users.find((u) => u.email === email) || null;
}

/**
 * Update a user's profile fields.
 *
 * @param {number} id
 * @param {object} updates - Partial { name, email }
 * @returns {object} Updated user (without password)
 */
function updateUser(id, updates) {
  const user = db.users.find((u) => u.id === id);
  if (!user) throw new Error(`User ${id} not found`);

  if (updates.name !== undefined) user.name = updates.name;
  if (updates.email !== undefined) user.email = updates.email;

  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

/**
 * List all users (without passwords).
 *
 * @returns {object[]}
 */
function listUsers() {
  return db.users.map(({ password: _pw, ...u }) => u);
}

/**
 * Reset internal id counter — intended for use in tests only.
 */
function _resetIdCounter() {
  nextId = 1;
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  listUsers,
  _resetIdCounter,
};
