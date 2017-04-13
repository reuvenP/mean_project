/**
 * Created by reuvenp on 4/13/2017.
 */
var express = require('express');
var router = express.Router();
var users = require('../modules/dal_users');
var rooms = require('../modules/dal_rooms');
var userRooms = require('../modules/dal_user_rooms');
var rsa = require('../modules/rsa');
var debug = require('debug')('nodejs-project:rooms');

router.get('/getRoomsOfUser', function (req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first');
    }

    userRooms.getRoomsOfUser(req.user._id, function (error, rooms) {
        if (error) {
            return res.status(500).send(error);
        }

        var roomsToSend = [];
        for (var i = 0; i < rooms.length; i++) {
            roomsToSend.push({_id: rooms[i]._id, name: rooms[i].name, admin_name: rooms[i].admin.name, admin_mail: rooms[i].admin.email, date_created: rooms[i].dateCreated});
        }
        res.json(roomsToSend);
    });
});

router.get('/getPendingRoomsOfUser', function (req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first');
    }

    userRooms.getPendingRoomsOfUser(req.user._id, function (error, rooms) {
        if (error) {
            return res.status(500).send(error);
        }

        var roomsToSend = [];
        for (var i = 0; i < rooms.length; i++) {
            roomsToSend.push({_id: rooms[i]._id, name: rooms[i].name, admin_name: rooms[i].admin.name, admin_mail: rooms[i].admin.email, date_created: rooms[i].dateCreated});
        }
        res.json(roomsToSend);
    });
});

router.get('/getAvailableRoomsOfUser', function (req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first');
    }

    userRooms.getAvailableRoomsOfUser(req.user._id, function (error, rooms) {
        if (error) {
            return res.status(500).send(error);
        }

        var roomsToSend = [];
        for (var i = 0; i < rooms.length; i++) {
            roomsToSend.push({_id: rooms[i]._id, name: rooms[i].name, admin_name: rooms[i].admin.name, admin_mail: rooms[i].admin.email, date_created: rooms[i].dateCreated});
        }
        res.json(roomsToSend);
    });
});

router.post('/join_room/:roomId', function (req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first');
    }

    userRooms.addUserRoom(req.user._id, req.params.roomId, function (error) {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).send('OK');
    });
});

router.post('/add_room/:roomName', function (req, res, next) {
    if (!req.user) {
        return res.status(401).send('You must login first');
    }

    rooms.addRoom(req.params.roomName, req.user._id,function (error, room) {
        if (error) {
            return res.status(500).send(error);
        }
        userRooms.addUserRoom(req.user._id, room._id, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            userRooms.confirmRoomUser(req.user._id, room._id, function (e) {
                if (e) {
                    return res.status(500).send(e);
                }
                res.status(200).send('OK');
            });
        });
    });
});

module.exports = router;