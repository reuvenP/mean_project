var express = require('express');
var router = express.Router();
var email = require('../modules/email');
var users = require('../modules/dal_users');
var debug = require('debug')('nodejs-project:login');

router.get('/getLoggedInUser', function(req, res,next) {
    if (!req.user) {
        return res.status(401).send('Not logged-in');
    }
    return res.json(req.user);
});

router.get('/forgotPassword/:username', function(req, res, next) {
    users.getUserByUsername(req.params.username, function(error, user) {
        if (error) {
            return res.status(500).send(error);
        }
        if (!user || user.isBlocked) {
            return res.status(500).send("Unknown or blocked user '" + req.params.username + "'");
        }
        user.recoveryNumber = Math.floor((Math.random() * 2000000000));
        users.editUser(user, function(error, newUser) {
            if (error) {
                return res.status(500).send(error);
            }
            var mailOptions = {
                from: '"Vaad Bait" <targil666@walla.co.il>',
                to: newUser.email, //TODO validate email address
                subject: 'Password recovery link for neighbor',
                //TODO IP address instead of http://localhost
                text: 'The recovery link is http://localhost:' + req.socket.localPort + '/login/recover/' + newUser.username + '?recoveryNumber=' + newUser.recoveryNumber
            };
            // send mail with defined transport object
            email.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.status(500).send(error);
                }
                res.send('Recovery link was sent to ' + newUser.email);
            });
        });
    });
});

router.get('/recover/:username', function (req, res, next) {
    if (req.params.username && req.query.recoveryNumber) {
        var recoveryNumber;
        try {
            recoveryNumber = parseInt(req.query.recoveryNumber);
        }
        catch (e) {
            return res.status(500).send('Invalid recovery link');
        }

        users.getUserByUsername(req.params.username, function (error, user) {
            if (user && !user.isBlocked && user.recoveryNumber === recoveryNumber) {
                users.deleteRecoveryNumber(user._id, function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    req.logout();
                    req.session.regenerate(function(err) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        req.login(user, function(err) {
                            if (err) {
                                return res.status(500).send(err);
                            }

                            delete(user._doc.password);
                            //res.json(user);
                            res.redirect('/#/home/editUser');
                        });
                    });
                });
            }
            else if (!user || user.isBlocked) {
                return res.status(500).send("Unknown or blocked user '" + req.params.username + "'");
            }
            else {
                return res.status(500).send('Invalid recovery link');
            }
        }, function () {
            return res.status(500).send('Invalid recovery link');
        });
    }
    else {
        return res.status(500).send('Invalid recovery link');
    }
});

module.exports = router;
