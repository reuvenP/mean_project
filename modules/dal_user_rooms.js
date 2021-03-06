/**
 * Created by reuvenp on 4/3/2017.
 */
var User = require('../models/user');
var Room = require('../models/room');
var UserRooms = require('../models/user_rooms');
var dal_rooms = require('./dal_rooms');
var dal_users = require('./dal_users');
var debug = require('debug')('nodejs-project:users');
var extend = require('util')._extend;

var addUserRoom = function (userId, roomId, then) {
      var userRooms = new UserRooms({
          userId: userId,
          roomId: roomId,
          counter: 0,
          isConfirmed: false
      });
      userRooms.save(then);
};

var getRoomsOfUser = function (userId, then) {
    UserRooms.find({userId: userId, isConfirmed: true}, function (err, userrooms) {
        if (err) return then(err, []);
        arr = [];
        for (var i = 0; i < userrooms.length; i++) {
            arr.push(userrooms[i].roomId);
        }
        Room.find({'_id': { $in: arr}}).populate('admin').exec(function(err, rooms){
            if (err) return then(err, []);
            return then(null, rooms)});
    });
};

var getPendingRoomsOfUser = function (userId, then) {
    UserRooms.find({userId: userId, isConfirmed: false}, function (err, userrooms) {
        if (err) return then(err, []);
        arr = [];
        for (var i = 0; i < userrooms.length; i++) {
            arr.push(userrooms[i].roomId);
        }
        Room.find({'_id': { $in: arr}}).populate('admin').exec(function(err, rooms){
            if (err) return then(err, []);
            return then(null, rooms)});
    });
};

var getAvailableRoomsOfUser = function (userId, then) {
    UserRooms.find({userId: userId}, function (err, userrooms) {
        if (err) return then(err, []);
        arr = [];
        for (var i = 0; i < userrooms.length; i++) {
            arr.push(userrooms[i].roomId);
        }
        Room.find({'_id': { $nin: arr}}).populate('admin').exec(function(err, rooms){
            if (err) return then(err, []);
            return then(null, rooms)});
    });
};

var confirmRoomUser = function (userId, roomId, then) {
    UserRooms.findOne({userId: userId, roomId: roomId}, function (err, userRoom) {
        if (err) return then(err);
        userRoom.isConfirmed = true;
        userRoom.save(then);
    })
};

var getRequestsOfUser = function (userId, then) {
    dal_rooms.getRoomsByAdmin(userId, function (err, rooms) {
        if (err) return then(err, []);

        roomsId = [];
        for (var i = 0; i < rooms.length; i++) {
            roomsId.push(rooms[i]._id);
        }

        UserRooms.find({'roomId': {$in: roomsId}, isConfirmed: false}).populate('roomId').populate('userId').exec(then);
    });
};

var exporter = {};
exporter.addUserRoom = addUserRoom;
exporter.getRoomsOfUser = getRoomsOfUser;
exporter.confirmRoomUser = confirmRoomUser;
exporter.getPendingRoomsOfUser = getPendingRoomsOfUser;
exporter.getAvailableRoomsOfUser = getAvailableRoomsOfUser;
exporter.getRequestsOfUser = getRequestsOfUser;

module.exports = exporter;