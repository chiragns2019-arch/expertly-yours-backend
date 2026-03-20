const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

      // Find user by email
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Create user
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatar,
            provider: 'google',
            role: 'SEEKER',
            // password left empty
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
