const { db } = require('../../config/database');
const { NOTIFICATION_TYPES } = require('../../config/constants');

let nextId = 1;

/**
 * Send a notification to a user.
 * In a real system this would dispatch to email/SMS/push.
 * Here it just persists a notification record.
 *
 * @param {number} userId
 * @param {string} type - One of NOTIFICATION_TYPES values
 * @param {object} [payload={}] - Additional data for the notification
 * @returns {object} Created notification
 */
function sendNotification(userId, type, payload = {}) {
  const validTypes = Object.values(NOTIFICATION_TYPES);
  if (!validTypes.includes(type)) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  const notification = {
    id: nextId++,
    userId,
    type,
    payload,
    read: false,
    sentAt: new Date().toISOString(),
  };

  db.notifications.push(notification);
  return notification;
}

/**
 * Retrieve all notifications for a user.
 *
 * @param {number} userId
 * @returns {object[]}
 */
function getNotificationsForUser(userId) {
  return db.notifications.filter((n) => n.userId === userId);
}

/**
 * Mark a notification as read.
 *
 * @param {number} notificationId
 * @returns {object} Updated notification
 */
function markAsRead(notificationId) {
  const notification = db.notifications.find((n) => n.id === notificationId);
  if (!notification) throw new Error(`Notification ${notificationId} not found`);

  notification.read = true;
  return notification;
}

/**
 * Count unread notifications for a user.
 *
 * @param {number} userId
 * @returns {number}
 */
function getUnreadCount(userId) {
  return db.notifications.filter((n) => n.userId === userId && !n.read).length;
}

/**
 * Reset internal id counter — intended for use in tests only.
 */
function _resetIdCounter() {
  nextId = 1;
}

module.exports = {
  sendNotification,
  getNotificationsForUser,
  markAsRead,
  getUnreadCount,
  _resetIdCounter,
};
