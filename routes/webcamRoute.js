/**
 * Created by reuvenp on 4/14/2017.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')('nodejs-project:chat');

router.get('/webcamsURL', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first for using the chat');
    }

    var webcams = [
        'http://69.193.149.90:82/mjpg/video.mjpg?COUNTER',
        'http://75.151.65.9/mjpg/video.mjpg?COUNTER',
        'http://46.146.210.29/mjpg/video.mjpg?COUNTER',
        'http://41.160.227.150:8083/mjpg/video.mjpg?COUNTER',
        'http://88.190.98.55/mjpg/video.mjpg?COUNTER',
        'http://220.240.123.205/mjpg/video.mjpg?COUNTER'
    ];

    res.json(webcams);

});

module.exports = router;
