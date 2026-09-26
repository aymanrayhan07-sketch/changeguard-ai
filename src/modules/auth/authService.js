const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/constants');
const userService = require('../users/userService');

/**
 * Register a new user and return a signed JWT.
 *
 * @param {object} data - { name, email, password }
 * @returns {{ user: object, token: string }}
 */
function register({ name, email, password }) {
  const user = userService.createUser({ name, email, password });
  const token = _signToken(user);
  return { user, token };
}

/**
 * Authenticate a user with email/password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ user: object, token: string }}
 */
function login(email, password) {
  const user = userService.getUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const { password: _pw, ...safeUser } = user;
  const token = _signToken(safeUser);
  return { user: safeUser, token };
}

/**
 * Verify a JWT and return its payload.
 *
 * @param {string} token
 * @returns {object} Decoded payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new Error('Invalid or expired token');
  }
}

/** @private */
function _signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

module.exports = { register, login, verifyToken };
