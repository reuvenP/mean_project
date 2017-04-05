var User = require('../models/user');
var debug = require('debug')('nodejs-project:users');
var extend = require('util')._extend;

var getUsers = function(onlyNotBlocked, then) {
    var query = onlyNotBlocked ? User.find({isDeleted: {$ne: true}, isBlocked: {$ne: true}}) : User.find({isDeleted: {$ne: true}});
    query.select('-password -recoveryNumber -isDeleted'); //TODO do -password -recoveryNumber in upper level
    query.exec(then);
};

var deleteUser = function(userId, then) {
    User.findById(userId, function (err, user) {
        if (err) return then(err, []);

        user.isDeleted = true;
        user.save(then);
    });
};

var getUserById = function(userId, then) {
    User.findById(userId, function (err, user) {
        if (err) return then(err, null);
        if (user && !user.isDeleted) {
            delete(user._doc.isDeleted);
            return then(null, user);
        }
        else {
            then("user not found", null)
        }
    });
};

var getUserByUsername = function(username, then) {
    User.find({username: username, isDeleted: {$ne: true}}, function (err, user) {
        if (err) return then(err, null);
        if (user.length > 0) {
            delete(user[0]._doc.isDeleted);
            return then(null, user[0]);
        }
        else {
            then("user not found", null)
        }
    });
};

var editUser = function(user, then) {
    getUserById(user._id, function(err, current) {
        if (err) return then(err);
        extend(current, user);
        current.save(then)
    });
};

var addUser = function(user, then) {
    var newUser = new User();
    extend(newUser, user);
    newUser.save(then);
};

var deleteRecoveryNumber = function(userId, then) {
    getUserById(userId, function(err, user) {
        if (err) return then(err);
        user.recoveryNumber = null;
        user.save(then);
    });
};

var exporter = {};
exporter.getUsers = getUsers;
exporter.getUserById = getUserById;
exporter.getUserByUsername = getUserByUsername;
exporter.deleteUser = deleteUser;
exporter.editUser = editUser;
exporter.addUser = addUser;
exporter.deleteRecoveryNumber = deleteRecoveryNumber;

module.exports = exporter;
