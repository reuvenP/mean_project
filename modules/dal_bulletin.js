/**
 * Created by reuvenp on 4/18/2017.
 */

var Bulletin = require('../models/bulletin');
var dal_users = require('./dal_users');
var debug = require('debug')('nodejs-project:bulletin');
var extend = require('util')._extend;

var addBullet = function(senderId, text, link, img, then) {
    dal_users.getUserById(senderId, function (err, user) {
        if (err) return then(err, null);
        if (!user.isAdmin) {
            return then('Non-admin not allowed', null);
        }

        var to_add = {
            sender: senderId,
            text: text,
            link: link,
            img: img,
            submitDate: new Date()
        };

        Bulletin.find({}, function (err, bullets) {
            if (err) return then(err, null);
            if (bullets.length >= 1) {
                bullets[0].msgs.push(to_add);
                bullets[0].save(function (err) {
                    if (err) return then(err, null);
                    return then(null, to_add);
                });
            }
            else {
                var bullet = new Bulletin({
                    msgs: [to_add]
                });
                bullet.save(function (err) {
                    if (err) return then(err, null);
                    return then(null, to_add);
                });
            }
        })
    });
};

var getBullets = function (then) {
    Bulletin.find({}, function (err, bullets) {
        if (err) return then(err, null);
        if (bullets.length == 0) {
            return then(null, []);
        }
        return then(null, bullets[0].msgs);
    })
};

var exporter = {};
exporter.addBullet = addBullet;
exporter.getBullets = getBullets;
module.exports = exporter;
