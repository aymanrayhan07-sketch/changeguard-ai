const { resetDb } = require('../../src/config/database');
const userService = require('../../src/modules/users/userService');
const authService = require('../../src/modules/auth/authService');

beforeEach(() => {
  resetDb();
  userService._resetIdCounter();
});

describe('authService', () => {
  describe('register', () => {
    it('creates a user and returns a JWT token', () => {
      const { user, token } = authService.register({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret123',
      });

      expect(user).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
    });

    it('throws when email is already registered', () => {
      authService.register({ name: 'Alice', email: 'alice@example.com', password: 'pw' });
      expect(() =>
        authService.register({ name: 'Alice2', email: 'alice@example.com', password: 'pw2' })
      ).toThrow(/already exists/);
    });
  });

  describe('login', () => {
    it('returns a token for correct credentials', () => {
      authService.register({ name: 'Alice', email: 'alice@example.com', password: 'mypassword' });
      const { user, token } = authService.login('alice@example.com', 'mypassword');

      expect(user.email).toBe('alice@example.com');
      expect(typeof token).toBe('string');
    });

    it('throws for wrong password', () => {
      authService.register({ name: 'Alice', email: 'alice@example.com', password: 'correct' });
      expect(() => authService.login('alice@example.com', 'wrong')).toThrow(/Invalid credentials/);
    });

    it('throws for unknown email', () => {
      expect(() => authService.login('nobody@example.com', 'pw')).toThrow(/Invalid credentials/);
    });
  });

  describe('verifyToken', () => {
    it('decodes a valid token and returns the payload', () => {
      const { token } = authService.register({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'pw',
      });

      const payload = authService.verifyToken(token);
      expect(payload.email).toBe('alice@example.com');
    });

    it('throws for a tampered token', () => {
      expect(() => authService.verifyToken('not.a.valid.jwt')).toThrow(
        /Invalid or expired token/
      );
    });
  });
});
