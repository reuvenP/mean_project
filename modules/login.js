var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var debug = require('debug')('nodejs-project:login');
var sha1 = require('sha1');
var users = require('./dal_users');

passport.use(new LocalStrategy(
    {usernameField: 'username', passwordField: 'hashedLogin'},
    function (username, hashedLogin, done) {
        users.getUserByUsername(username, function(error, user) {
            if (error) {
                debug("Login error: " + error);
                return done(error);
            }
            if (!user || user.isBlocked) {
                debug("Login no user: " + error);
                return done(null, false, {message: "User '" + username + "' doesn't exist or blocked"});
            }

            //password cannot be checked here since we need the random number from the session.
            //the authentication continues in the following userAuthenticator middleware
            return done(null, user);
        });
    }
));

var userAuthenticator = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        debug("start");
        //get user object from LocalStrategy
        if (err) {
            return res.status(500).send('User authentication failed: ' + err);
        }
        if (!user) {
            return res.status(401).send("Unknown or blocked user '" + req.body.username + "'");
        }

        //check the login details that were hashed by random number
        var realHash = sha1(user.username + ':' + user.password + ':' + req.session.random);
        if (realHash !== req.body.hashedLogin) {
            return res.status(401).send("Wrong password for '" + user.username + "'");
        }

        // If we are here then authentication was successful.
        delete(user._doc.password);
        delete(user._doc.recoveryNumber);
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).send("Login error for '" + user.username + "':" + err);
            }
            debug("Logged as: " + user.username);
            return res.json(user);
        });
    })(req, res, next);
};

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    users.getUserById(id, function(err, user) {
        if (err) return done(err, null);
        if (user.isDeleted || user.isBlocked) return done(null, null);
        delete(user._doc.password);
        delete(user._doc.recoveryNumber);
        done(null, user);
    });
});

var exporter = {};
exporter.authenticator = userAuthenticator;

module.exports = exporter;
