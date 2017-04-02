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
    room.save(function (err) {
        if (err) return then(err);
        return then();
    })
};

var getRooms = function (then) {
    Room.find({}, function (err, rooms) {
        return then(err, rooms);
    })
};

var getLastTwentyMsgsOfRoom = function (roomId, then) {
    Message.find({room: roomId},[], {limit: 20, sort: {submitDate: -1}}, function (err, msgs) {
        if (err) return then(err, msgs);
        var newMsgs = [];
        for (var i = msgs.length - 1; i >=0; i--) {
            newMsgs.push(msgs[i]);
        }
        return then(null, newMsgs);
    })
};

var exporter = {};
exporter.addRoom = addRoom;
exporter.getRooms = getRooms;
exporter.getLastTwentyMsgsOfRoom = getLastTwentyMsgsOfRoom;
module.exports = exporter;
