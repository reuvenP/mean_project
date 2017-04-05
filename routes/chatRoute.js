var express = require('express');
var router = express.Router();
var debug = require('debug')('nodejs-project:chat');
var mongo = require("mongoose");
var dal_rooms = require('../modules/dal_rooms');
var dal_messages = require('../modules/dal_messages');

router.post('/sendMessage', function (req, res, next) {
    var message = req.body.message;
    var roomId = mongo.Types.ObjectId(message.room);
    dal_messages.addMessage(req.user._id, roomId, message.text, message.link, message.img, message.isOnlyForConnected,
        function(error, msg) {
            if (error) {
                return res.status(500).send(error);
            }

            res.json(msg);
            //TODO send by socket.io to all users that currently connected to the room
        }
    );
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

router.get('/roomOfflineMessages/:roomId', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first for using the chat');
    }

    //TODO get only mesaage that were marked for offline, and the current user didn't got yet
    //since he was offline when they sent
    dal_rooms.getMsgsByRoom(req.params.roomId, function(error, messages) {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(messages);
    })
});

module.exports = router;
