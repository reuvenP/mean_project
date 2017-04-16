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
        {header: 'Elevator', url: 'http://69.193.149.90:82/mjpg/video.mjpg?COUNTER'},
        {header: 'Pool', url: 'http://75.151.65.9/mjpg/video.mjpg?COUNTER'},
        {header: 'Lobby', url: 'http://46.146.210.29/mjpg/video.mjpg?COUNTER'},
        {header: 'Control', url: 'http://41.160.227.150:8083/mjpg/video.mjpg?COUNTER'},
        {header: 'Buffet', url: 'http://88.190.98.55/mjpg/video.mjpg?COUNTER'},
        {header: 'Avenue', url: 'http://220.240.123.205/mjpg/video.mjpg?COUNTER'},
        {header: 'Bar', url: 'http://83.40.74.116:81/mjpg/video.mjpg?COUNTER'},
        {header: 'Church', url: 'http://194.46.230.57:1024/mjpg/video.mjpg?COUNTER'},
        {header: 'Lab', url: 'http://138.234.104.28:8080/mjpg/video.mjpg?COUNTER'}
    ];

    res.json(webcams);

});

module.exports = router;
