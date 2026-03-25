const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { randomUUID: uuidv4 } = require('crypto');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user ID
    const userId = uuidv4();
    const createdAt = new Date();

    // Create user
    await pool.query(
      'INSERT INTO User (id, name, email, password, role, provider, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role, 'email', createdAt]
    );

    // Create ExpertProfile if role is EXPERT
    if (role === 'EXPERT') {
      const expertId = uuidv4();
      await pool.query(
        'INSERT INTO ExpertProfile (id, userId, status, skills, usefulnessScore, requirementsReceived, allowsDirectBooking, hourlyRate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [expertId, userId, 'PENDING_APPROVAL', '[]', 0, 0, false, 0, createdAt, createdAt]
      );
    }

    res.status(201).json({
      id: userId,
      name,
      email,
      role,
      token: generateToken(userId),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    const user = users[0];

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = (req, res) => {
  // Successful authentication, generate token.
  // req.user is set by passport.
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (!req.user) {
    console.log("Google auth failed: no user on req");
    return res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }

  const token = generateToken(req.user.id);
  console.log("Google auth success. USER:", req.user.id, "TOKEN:", token.slice(0, 20) + "...");

  const params = new URLSearchParams({
    token,
    userId: req.user.id,
    name: req.user.name || '',
    role: req.user.role || 'SEEKER',
  });

  res.redirect(`${frontendUrl}/auth-success?${params.toString()}`);
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthCallback,
};
