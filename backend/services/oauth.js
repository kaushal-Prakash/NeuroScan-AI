import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const name = profile.displayName;
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          const hashedPassword = await bcrypt.hash(
            Math.random().toString(36).slice(-8),
            10
          );
          user = new User({
            name,
            email,
            password: hashedPassword,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
