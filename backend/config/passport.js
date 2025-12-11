const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          // Create new user from Google profile
          const adminEmails = ['fenil1723@gmail.com', 'sapatel241980@gmail.com'];
          user = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              name: profile.displayName,
              password: '', // No password for OAuth users
              role: adminEmails.includes(profile.emails[0].value) ? 'admin' : 'user',
              profileImage: profile.photos?.[0]?.value || null,
            },
          });
        } else {
          // Update profile image if changed
          if (profile.photos?.[0]?.value && user.profileImage !== profile.photos[0].value) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { profileImage: profile.photos[0].value },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
