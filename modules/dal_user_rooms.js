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
    UserRooms.find({userId: userId, isConfirmed: true}, then);
};

var confirmRoomUser = function (userId, roomId, then) {
    UserRooms.findOne({userId: userId, roomId: roomId}, function (err, userRoom) {
        if (err) return then(err);
        userRoom.isConfirmed = true;
        userRoom.save(then);
    })
};

var pendingRequests = function (adminId, then) {
    //TODO:
};

var exporter = {};
exporter.addUserRoom = addUserRoom;
exporter.getRoomsOfUser = getRoomsOfUser;
exporter.confirmRoomUser = confirmRoomUser;

module.exports = exporter;