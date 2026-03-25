const pool = require('../config/db');

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const [notifications] = await pool.query('SELECT * FROM Notification WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
    notifications.forEach(n => n.isRead = !!n.isRead);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as unreadCount FROM Notification WHERE userId = ? AND isRead = 0', [req.user.id]);
    // COUNT(*) returns as big int or number, force to Number just in case
    res.json({ unreadCount: Number(rows[0].unreadCount) });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notifications as read
// @route   PATCH /api/notifications/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    await pool.query('UPDATE Notification SET isRead = 1 WHERE userId = ? AND isRead = 0', [req.user.id]);
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
};
