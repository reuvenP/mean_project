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

router.get('/roomLastMessages/:roomId', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first for using the chat');
    }

    dal_rooms.getLastMsgsOfRoom(req.params.roomId, function(error, messages) {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(messages);
    })
});

router.get('/roomMessages/:roomId', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first');
    }

    dal_rooms.getMsgsByRoom(req.params.roomId, function(error, messages) {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(messages);
    })
});

router.get('/userMessages/:userId', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first');
    }

    dal_messages.getMessagesBySender(req.params.userId, function(error, messages) {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(messages);
    })
});

router.post('/likeMessage/:messageId', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('Not logged-in');
    }

    dal_messages.addVote(req.params.messageId, true, req.connection.remoteAddress,
        function(error, message) {
            if (error) {
                return res.status(500).send(error);
            }
            res.json(message);
        }
    );
});

router.post('/dislikeMessage/:messageId', function(req, res, next) {
    if (!req.user) {
        return res.status(401).send('Not logged-in');
    }

    dal_messages.addVote(req.params.messageId, false, req.connection.remoteAddress,
        function(error, message) {
            if (error) {
                return res.status(500).send(error);
            }
            res.json(message);
        }
    );
});

module.exports = router;
