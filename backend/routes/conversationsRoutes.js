const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { listConversations } = require('../controllers/conversationController');

// Handles GET /api/conversations
router.get('/', protect, listConversations);

module.exports = router;
