const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser, googleAuthCallback } = require('../controllers/authController');

router.post('/signup', registerUser);
router.post('/login', loginUser);

// Google OAuth Init
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google OAuth Callback
router.get(
  '/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }), 
  googleAuthCallback
);

module.exports = router;
