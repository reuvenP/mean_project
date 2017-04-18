/**
 * Created by reuvenp on 15/03/2017.
 */
var Message = require('../models/message');
var Room = require('../models/room');
var debug = require('debug')('nodejs-project:users');
var extend = require('util')._extend;

var addRoom = function (name, adminId, then) {
    var room = new Room({
        name: name,
        admin: adminId,
        dateCreated: new Date()
    });
    room.save(then);
};

var getRooms = function (then) {
    Room.find({}, then);
};

var getLastMsgsOfRoom = function (roomId, then) {
    Message.find({room: roomId, isOnlyForConnected: false},[], {limit: 20, sort: {submitDate: -1}}, function (err, msgs) {
        if (err) return then(err, msgs);
        var newMsgs = [];
        for (var i = msgs.length - 1; i >=0; i--) {
            newMsgs.push(msgs[i]);
        }
        return then(null, newMsgs);
    })
};

var getMsgsByRoom = function (roomId, then) {
    Message.find({room: roomId, isOnlyForConnected: false}, [], {sort: {submitDate: 1}}, then);
};

var getRoomById = function (roomId, then) {
    Room.findById(roomId, then);
};

var getRoomsByAdmin = function (adminId, then) {
    Room.find({admin: adminId}, then);
};

var exporter = {};
exporter.addRoom = addRoom;
exporter.getRooms = getRooms;
exporter.getLastMsgsOfRoom = getLastMsgsOfRoom;
exporter.getMsgsByRoom = getMsgsByRoom;
exporter.getRoomById = getRoomById;
exporter.getRoomsByAdmin = getRoomsByAdmin;
module.exports = exporter;
