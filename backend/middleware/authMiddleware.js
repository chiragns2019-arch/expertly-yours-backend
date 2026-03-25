const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log("TOKEN received:", token.slice(0, 20) + "...");

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Get user from the token (select id, name, email, role)
      const [users] = await pool.query(
        'SELECT id, name, email, role FROM User WHERE id = ?',
        [decoded.id]
      );
      
      const user = users[0];
      if (!user) {
        throw new Error('User not found');
      }

      req.user = user;
      console.log("USER:", req.user);
      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

const admin = authorize('ADMIN');

module.exports = { protect, authorize, admin };
