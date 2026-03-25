const pool = require('../config/db');
const { randomUUID: uuidv4 } = require('crypto');

// @desc    Add a bookmark
// @route   POST /api/bookmarks
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const { expertId } = req.body;
    const seekerId = req.user.id;

    const [existing] = await pool.query(
      'SELECT id FROM Bookmark WHERE seekerId = ? AND expertId = ?', 
      [seekerId, expertId]
    );

    if (existing.length > 0) {
      res.status(400);
      throw new Error('Already bookmarked');
    }

    const bookmarkId = uuidv4();
    await pool.query(
      'INSERT INTO Bookmark (id, seekerId, expertId, createdAt) VALUES (?, ?, ?, ?)',
      [bookmarkId, seekerId, expertId, new Date()]
    );

    const [createdRows] = await pool.query(`
      SELECT b.*, e.id as expert_id, u.name as expertName, u.avatar as expertAvatar
      FROM Bookmark b
      JOIN ExpertProfile e ON b.expertId = e.id
      JOIN User u ON e.userId = u.id
      WHERE b.id = ?
    `, [bookmarkId]);

    const { expertName, expertAvatar, expert_id, ...bData } = createdRows[0];
    bData.expert = {
      id: expert_id,
      user: { name: expertName, avatar: expertAvatar }
    };

    res.status(201).json(bData);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const [bookmarks] = await pool.query('SELECT * FROM Bookmark WHERE id = ?', [req.params.id]);
    const bookmark = bookmarks[0];

    if (!bookmark) {
      res.status(404);
      throw new Error('Bookmark not found');
    }

    if (bookmark.seekerId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to remove this bookmark');
    }

    await pool.query('DELETE FROM Bookmark WHERE id = ?', [req.params.id]);

    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    List bookmarks
// @route   GET /api/bookmarks
// @access  Private
const listBookmarks = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, e.id as expert_id, u.name as expertName, u.avatar as expertAvatar
      FROM Bookmark b
      JOIN ExpertProfile e ON b.expertId = e.id
      JOIN User u ON e.userId = u.id
      WHERE b.seekerId = ?
      ORDER BY b.createdAt DESC
    `, [req.user.id]);

    const bookmarks = rows.map(r => {
      const { expertName, expertAvatar, expert_id, ...bData } = r;
      return {
        ...bData,
        expert: {
          id: expert_id,
          user: { name: expertName, avatar: expertAvatar }
        }
      };
    });

    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  listBookmarks,
};
