const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { listConversations, getMessages, sendMessage } = require('../controllers/messageController');

router.get('/conversations', protect, listConversations);
router.get('/:conversationId', protect, getMessages);
router.post('/:conversationId', protect, sendMessage);

module.exports = router;
