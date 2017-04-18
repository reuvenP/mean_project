/**
 * Created by reuvenp on 4/18/2017.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')('nodejs-project:bulletin');
var mongo = require("mongoose");
var dal_bulletin = require('../modules/dal_bulletin');

router.post('/addBullet', function (req, res, next) {
    var bullet = req.body.msg;
    dal_bulletin.addBullet(req.user._id, bullet.text, bullet.link, bullet.img,
        function(error, msg) {
            if (error) {
                return res.status(500).send(error);
            }

            res.json(msg);
        }
    );
});

router.get('/getBulletin', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first for using the chat');
    }

    dal_bulletin.getBullets(function (err, bullets) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(bullets);
    });
});


module.exports = router;
