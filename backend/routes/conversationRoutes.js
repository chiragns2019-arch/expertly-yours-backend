const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { startConversation } = require('../controllers/conversationController');

// Handles POST /api/conversation/start
router.post('/start', protect, startConversation);

module.exports = router;
