var express = require('express');
var router = express.Router();
var debug = require('debug')('nodejs-project:chat');
var dal_rooms = require('../modules/dal_rooms');
var dal_messages = require('../modules/dal_messages');

router.post('/sendMessage', function (req, res, next) {
    var message = req.body.message;
    var roomId = message.room;
    dal_messages.addMessage(req.user._id, roomId, message.text, message.link, message.img, message.isOnlyForConnected,
        function(error) {
            if (error) {
                return res.status(500).send(error);
            }

            res.send();
            //TODO send by socket.io to all users that currently connected to the room
        }
    );
});

router.get('/loadOfflineMessages/:roomId', function(req, res, next) {
    var userId = req.body.user._id;
    //TODO get from db the last messages of that room that were sent while the user was offline
});

router.get('/getRooms', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first for using the chat');
    }

    dal_rooms.getRooms(function(error, rooms) {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(rooms);
    })
});

router.get('/roomsMessages/:roomId', function(req, res, next) {
    dal_rooms.getMsgsByRoom(req.param.roomId, function(error, messages) {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(messages);
    })
});

module.exports = router;
