/**
 * Created by reuvenp on 15/03/2017.
 */

var dal_messages = require('./dal_messages');
var dal_rooms = require('./dal_rooms');
var dat_users = require('./dal_users');

var configSocketIo = function(httpServer) {
    var io = require('socket.io')(httpServer);
    io.on('connection', function (socket) {

    });
};

module.exports = configSocketIo;