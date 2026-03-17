const express = require('express');
const router = express.Router();
const { discoverExperts, getExpertProfile, submitExpertProfile } = require('../controllers/expertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/discover', discoverExperts);
router.post('/submit', protect, submitExpertProfile);
router.get('/:id', getExpertProfile);

module.exports = router;
