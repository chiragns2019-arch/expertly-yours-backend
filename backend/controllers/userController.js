const pool = require('../config/db');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT * FROM User WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (user) {
      if (user.role === 'EXPERT') {
        const [profiles] = await pool.query('SELECT * FROM ExpertProfile WHERE userId = ?', [req.user.id]);
        user.expertProfile = profiles[0] || null;
      }
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT * FROM User WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (user) {
      const name = req.body.name !== undefined ? req.body.name : user.name;
      const email = req.body.email !== undefined ? req.body.email : user.email;
      const avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

      await pool.query(
        'UPDATE User SET name = ?, email = ?, avatar = ? WHERE id = ?',
        [name, email, avatar, req.user.id]
      );

      // Update expert profile if exists and is provided
      if (user.role === 'EXPERT' && req.body.expertProfile) {
        const e = req.body.expertProfile;
        
        // Fetch current to merge
        const [profiles] = await pool.query('SELECT * FROM ExpertProfile WHERE userId = ?', [req.user.id]);
        const currentE = profiles[0];

        if (currentE) {
          await pool.query(
            `UPDATE ExpertProfile SET 
             title = COALESCE(?, title), 
             expertise = COALESCE(?, expertise), 
             hourlyRate = COALESCE(?, hourlyRate), 
             linkedinUrl = COALESCE(?, linkedinUrl), 
             behanceUrl = COALESCE(?, behanceUrl), 
             websiteUrl = COALESCE(?, websiteUrl), 
             allowsDirectBooking = COALESCE(?, allowsDirectBooking)
             WHERE userId = ?`,
            [
              e.title !== undefined ? e.title : null,
              e.expertise !== undefined ? e.expertise : null,
              e.hourlyRate !== undefined ? e.hourlyRate : null,
              e.linkedinUrl !== undefined ? e.linkedinUrl : null,
              e.behanceUrl !== undefined ? e.behanceUrl : null,
              e.websiteUrl !== undefined ? e.websiteUrl : null,
              e.allowsDirectBooking !== undefined ? (e.allowsDirectBooking ? 1 : 0) : null,
              req.user.id
            ]
          );
        }
      }

      // Fetch fresh user
      const [freshUsers] = await pool.query('SELECT * FROM User WHERE id = ?', [req.user.id]);
      const freshUser = freshUsers[0];
      
      if (freshUser && freshUser.role === 'EXPERT') {
        const [profiles] = await pool.query('SELECT * FROM ExpertProfile WHERE userId = ?', [req.user.id]);
        freshUser.expertProfile = profiles[0] || null;
      }

      res.json(freshUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
