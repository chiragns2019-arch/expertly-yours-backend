const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
const { randomUUID: uuidv4 } = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

      // Find user by email
      const [users] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
      let user = users[0];

      if (!user) {
        // Create user
        const userId = uuidv4();
        const createdAt = new Date();
        await pool.query(
          'INSERT INTO User (id, name, email, avatar, provider, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [userId, name, email, avatar, 'google', 'SEEKER', createdAt]
        );
        user = {
          id: userId,
          name,
          email,
          avatar,
          provider: 'google',
          role: 'SEEKER',
          createdAt
        };
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
