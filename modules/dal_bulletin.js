/**
 * Created by reuvenp on 4/18/2017.
 */

var Message = require('../models/bulletin');
var dal_users = require('./dal_users');
var debug = require('debug')('nodejs-project:bulletin');
var extend = require('util')._extend;

var addBullet = function(senderId, text, link, img, then) {
    dal_users.getUserById(senderId, function (err, user) {
        if (err) return then(err, null);
        if (!user.isAdmin) {
            return then('Non-admin not allowed', null);
        }


    });
    var message = new Message({
        sender: senderId,
        room: roomId,
        text: text,
        link: link,
        img: img,
        submitDate: new Date(),
        positiveVotes: 0,
        negativeVotes: 0,
        isOnlyForConnected: isOnlyForConnected
    });
    message.save(then);
};


var exporter = {};
exporter.addBullet = addBullet;
module.exports = exporter;
