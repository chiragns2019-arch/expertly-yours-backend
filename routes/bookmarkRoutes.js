const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addBookmark, removeBookmark, listBookmarks } = require('../controllers/bookmarkController');

router.post('/', protect, addBookmark);
router.delete('/:id', protect, removeBookmark);
router.get('/', protect, listBookmarks);

module.exports = router;
