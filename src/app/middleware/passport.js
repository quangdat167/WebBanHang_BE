const User = require('../models/User');
const { JWT_SECRETKEY } = require('../../config/jwt');
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Passport-local
const LocalStrategy = require('passport-local').Strategy;
passport.use(
    new LocalStrategy(async function (username, password, done) {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false);
            const isCorrectpassword = await user.isValidPassword(password);
            if (!isCorrectpassword) return done(null, false);
            done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }),
);

// Passport-jwt
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRETKEY,
        },
        async function (payload, done) {
            try {
                const user = await User.findById(payload.sub);
                if (!user) return done(null, false);
                done(null, user);
            } catch (error) {
                return done(error, false);
            }
        },
    ),
);
