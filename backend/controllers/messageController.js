const pool = require('../config/db');
const { sendEmailNotification } = require('../utils/mailer');
const { randomUUID: uuidv4 } = require('crypto');

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const [convs] = await pool.query('SELECT id FROM Conversation WHERE id = ?', [conversationId]);
    if (convs.length === 0) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    const [messages] = await pool.query('SELECT * FROM Message WHERE conversationId = ? ORDER BY createdAt ASC', [conversationId]);
    messages.forEach(m => m.isRead = !!m.isRead);

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text, content } = req.body;
    const finalContent = content || text; // Accommodate either key

    if (!finalContent) {
      res.status(400);
      throw new Error('Message content is required');
    }

    const [convRows] = await pool.query(`
      SELECT c.*, 
             u1.id as u1Id, u1.email as u1Email, u1.name as u1Name,
             u2.id as u2Id, u2.email as u2Email, u2.name as u2Name
      FROM Conversation c
      JOIN User u1 ON c.user1Id = u1.id
      JOIN User u2 ON c.user2Id = u2.id
      WHERE c.id = ?
    `, [conversationId]);
    
    const conv = convRows[0];
    if (!conv) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    const messageId = uuidv4();
    const now = new Date();

    await pool.query(
      'INSERT INTO Message (id, conversationId, senderId, content, isRead, createdAt) VALUES (?, ?, ?, ?, 0, ?)',
      [messageId, conversationId, req.user.id, finalContent, now]
    );

    await pool.query(
      'UPDATE Conversation SET updatedAt = ? WHERE id = ?',
      [now, conversationId]
    );

    let otherUserId, otherUserEmail, otherUserName;
    if (req.user.id === conv.u1Id) {
      otherUserId = conv.u2Id;
      otherUserEmail = conv.u2Email;
      otherUserName = conv.u2Name;
    } else {
      otherUserId = conv.u1Id;
      otherUserEmail = conv.u1Email;
      otherUserName = conv.u1Name;
    }

    // Trigger Notification
    await pool.query(
      'INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?)',
      [uuidv4(), otherUserId, 'New Message', `You have a new message from ${req.user.name}`, 'message', now]
    );

    // Trigger Email Notification via nodemailer
    console.log(`[DEBUG] Attempting to send email notification to: ${otherUserEmail}`);
    await sendEmailNotification(otherUserEmail, "New Message on Expertly Yours", `You have received a new message from ${req.user.name}: "${finalContent}"`);
    console.log(`[DEBUG] Email notification logic completed for message ID: ${messageId}`);

    const [inserted] = await pool.query('SELECT * FROM Message WHERE id = ?', [messageId]);
    inserted[0].isRead = !!inserted[0].isRead;
    
    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error("SendMessage Error:", error);
    next(error);
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
