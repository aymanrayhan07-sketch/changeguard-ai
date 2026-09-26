const { resetDb } = require('../../src/config/database');
const userService = require('../../src/modules/users/userService');

beforeEach(() => {
  resetDb();
  userService._resetIdCounter();
});

describe('userService', () => {
  describe('createUser', () => {
    it('creates a user and returns safe fields (no password)', () => {
      const user = userService.createUser({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret123',
      });

      expect(user).toMatchObject({ id: 1, name: 'Alice', email: 'alice@example.com' });
      expect(user.password).toBeUndefined();
    });

    it('throws if email is already taken', () => {
      userService.createUser({ name: 'Alice', email: 'alice@example.com', password: 'secret' });
      expect(() =>
        userService.createUser({ name: 'Bob', email: 'alice@example.com', password: 'other' })
      ).toThrow(/already exists/);
    });

    it('throws if required fields are missing', () => {
      expect(() => userService.createUser({ email: 'x@x.com', password: 'p' })).toThrow(
        /required/
      );
    });
  });

  describe('getUserById', () => {
    it('returns the user without password', () => {
      const created = userService.createUser({ name: 'Alice', email: 'a@a.com', password: 'pw' });
      const found = userService.getUserById(created.id);
      expect(found).toMatchObject({ id: created.id, name: 'Alice' });
      expect(found.password).toBeUndefined();
    });

    it('returns null for unknown id', () => {
      expect(userService.getUserById(999)).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('updates name and email', () => {
      const user = userService.createUser({ name: 'Alice', email: 'a@a.com', password: 'pw' });
      const updated = userService.updateUser(user.id, { name: 'Alicia', email: 'new@a.com' });
      expect(updated.name).toBe('Alicia');
      expect(updated.email).toBe('new@a.com');
    });

    it('throws for unknown user', () => {
      expect(() => userService.updateUser(999, { name: 'X' })).toThrow(/not found/);
    });
  });

  describe('listUsers', () => {
    it('returns all users without passwords', () => {
      userService.createUser({ name: 'A', email: 'a@a.com', password: 'pw' });
      userService.createUser({ name: 'B', email: 'b@b.com', password: 'pw' });
      const users = userService.listUsers();
      expect(users).toHaveLength(2);
      users.forEach((u) => expect(u.password).toBeUndefined());
    });
  });
});
