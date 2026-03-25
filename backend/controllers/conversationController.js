const pool = require('../config/db');
const { sendEmailNotification } = require('../utils/mailer');
const { randomUUID: uuidv4 } = require('crypto');

// @desc    Start or fetch a conversation
// @route   POST /api/conversation/start
// @access  Private
const startConversation = async (req, res, next) => {
  try {
    const { ownerId } = req.body;
    
    if (!ownerId) {
      res.status(400);
      throw new Error('Owner ID is required to start a conversation');
    }
    
    // Sort IDs so user1Id and user2Id are consistently ordered to prevent duplicate convos
    const ids = [req.user.id, ownerId].sort();
    const user1Id = ids[0];
    const user2Id = ids[1];
    
    if (user1Id === user2Id) {
      res.status(400);
      throw new Error('Cannot start conversation with yourself');
    }

    let [convs] = await pool.query('SELECT * FROM Conversation WHERE user1Id = ? AND user2Id = ?', [user1Id, user2Id]);
    let conversation = convs[0];
    const isNew = !conversation;

    if (isNew) {
      const convId = uuidv4();
      const now = new Date();
      await pool.query(
        'INSERT INTO Conversation (id, user1Id, user2Id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        [convId, user1Id, user2Id, now, now]
      );
      
      const [newConvs] = await pool.query('SELECT * FROM Conversation WHERE id = ?', [convId]);
      conversation = newConvs[0];
    }

    // Determine the other user's ID
    const otherUserId = req.user.id === user1Id ? user2Id : user1Id;
    
    const [users] = await pool.query('SELECT id, email, name FROM User WHERE id = ?', [otherUserId]);
    const otherUser = users[0];

    if (isNew && otherUser) {
      // Send Notification
      await pool.query(
        'INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?)',
        [uuidv4(), otherUserId, 'New Conversation', `New conversation started with you by ${req.user.name}`, 'conversation', new Date()]
      );

      console.log(`[DEBUG] Attempting to send "New Conversation" email notification to: ${otherUser.email}`);
      // Send Email
      await sendEmailNotification(otherUser.email, "New Conversation on Expertly Yours", `You have a new conversation started by ${req.user.name}!`);
      console.log(`[DEBUG] Email notification logic completed for conversation ID: ${conversation.id}`);
    }

    const [user1Rows] = await pool.query('SELECT id, email, name FROM User WHERE id = ?', [user1Id]);
    const [user2Rows] = await pool.query('SELECT id, email, name FROM User WHERE id = ?', [user2Id]);

    const result = {
      ...conversation,
      user1: user1Rows[0] || null,
      user2: user2Rows[0] || null
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    List user's conversations
// @route   GET /api/conversations
// @access  Private
const listConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // We fetch conversations for the user and join the other participant's details
    const [rows] = await pool.query(`
      SELECT c.*, 
        u1.id as u1Id, u1.name as u1Name, u1.avatar as u1Avatar,
        u2.id as u2Id, u2.name as u2Name, u2.avatar as u2Avatar
      FROM Conversation c
      JOIN User u1 ON c.user1Id = u1.id
      JOIN User u2 ON c.user2Id = u2.id
      WHERE c.user1Id = ? OR c.user2Id = ?
      ORDER BY c.updatedAt DESC
    `, [userId, userId]);

    // For each conversation, we need the latest message
    const formatted = [];
    for (let r of rows) {
      const [messages] = await pool.query('SELECT content, createdAt FROM Message WHERE conversationId = ? ORDER BY createdAt DESC LIMIT 1', [r.id]);
      const lastMessage = messages[0];

      const isUser1 = r.u1Id === userId;
      const participantId = isUser1 ? r.u2Id : r.u1Id;
      const participantName = isUser1 ? r.u2Name : r.u1Name;
      const participantAvatar = isUser1 ? r.u2Avatar : r.u1Avatar;

      formatted.push({
        id: r.id,
        participantId,
        participantName,
        participantAvatar,
        participantTitle: 'Network Member',
        lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
        lastMessageTime: lastMessage ? lastMessage.createdAt : r.updatedAt,
        unreadCount: 0,
      });
    }

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startConversation,
  listConversations,
};
