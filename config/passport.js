const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                console.log('Attempting authentication for username:', username);
                const user = await User.findOne({
                    $or: [
                        { email: username },
                        { gamertag: username }
                    ]
                });

                if (!user) {
                    console.log('User not found for username:', username);
                    return done(null, false, { message: 'Invalid username or password' });
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    console.log('User authenticated:', user);
                    return done(null, user);
                } else {
                    console.log('Incorrect password for user:', user);
                    return done(null, false, { message: 'Invalid username or password' });
                }
            } catch (error) {
                console.error('Error during authentication:', error);
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
