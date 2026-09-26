const { resetDb } = require('../../src/config/database');
const notificationService = require('../../src/modules/notifications/notificationService');

beforeEach(() => {
  resetDb();
  notificationService._resetIdCounter();
});

const USER_ID = 7;

describe('notificationService', () => {
  describe('sendNotification', () => {
    it('creates and returns a notification record', () => {
      const n = notificationService.sendNotification(USER_ID, 'ORDER_CONFIRMED', {
        orderId: 1,
      });

      expect(n).toMatchObject({
        id: 1,
        userId: USER_ID,
        type: 'ORDER_CONFIRMED',
        read: false,
      });
      expect(n.payload.orderId).toBe(1);
    });

    it('throws for an unknown notification type', () => {
      expect(() =>
        notificationService.sendNotification(USER_ID, 'INVALID_TYPE', {})
      ).toThrow(/Unknown notification type/);
    });
  });

  describe('getNotificationsForUser', () => {
    it('returns only notifications for the given user', () => {
      notificationService.sendNotification(USER_ID, 'ORDER_CONFIRMED', {});
      notificationService.sendNotification(99, 'PAYMENT_SUCCESS', {});

      const notifications = notificationService.getNotificationsForUser(USER_ID);
      expect(notifications).toHaveLength(1);
      expect(notifications[0].userId).toBe(USER_ID);
    });

    it('returns an empty array if no notifications exist', () => {
      expect(notificationService.getNotificationsForUser(USER_ID)).toEqual([]);
    });
  });

  describe('markAsRead', () => {
    it('marks a notification as read', () => {
      const n = notificationService.sendNotification(USER_ID, 'ORDER_SHIPPED', {});
      const updated = notificationService.markAsRead(n.id);
      expect(updated.read).toBe(true);
    });

    it('throws for unknown notification id', () => {
      expect(() => notificationService.markAsRead(999)).toThrow(/not found/);
    });
  });

  describe('getUnreadCount', () => {
    it('returns the number of unread notifications', () => {
      const n1 = notificationService.sendNotification(USER_ID, 'ORDER_CONFIRMED', {});
      notificationService.sendNotification(USER_ID, 'ORDER_SHIPPED', {});
      notificationService.markAsRead(n1.id);

      expect(notificationService.getUnreadCount(USER_ID)).toBe(1);
    });
  });
});
