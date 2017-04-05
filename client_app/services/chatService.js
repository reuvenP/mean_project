angular.module('myApp').factory('chatService', ['$http', '$q', chatService]);
function chatService($http, $q) {
    var services = {};
    services.rooms = [];
    var socket = io();
    socket.emit('join', 'room1');
    socket.emit('leave', 'room5');


    services.getRoom = function (roomId) {
        for (var i = 0; i < services.rooms.length; i++) {
            if (services.rooms[i]._id == roomId) {
                return services.rooms[i];
            }
        }
    };

    services.getRoomOfflineMessages = function (roomId) {
        var deferred = $q.defer();
        $http.get('/chat/roomOfflineMessages/' + roomId).then(
            function (res) {
                var messagesList = services.getRoom(roomId).messages;
                messagesList.length = 0;
                var loadedMessages = res.data;
                for (var i = 0; i < loadedMessages.length; i++) {
                    messagesList[i] = loadedMessages[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.getRooms = function () {
        services.rooms.length = 0;
        var deferred = $q.defer();
        $http.get('/chat/getRooms').then(
            function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    services.rooms[i] = res.data[i];
                    services.rooms[i].messages = [];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.sendMessage = function(message) {
        var room = services.getRoom(message.room);
        if (!room) {
            return;
        }

        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/chat/sendMessage',
            data: { message: message }
        };
        $http(req).then(
            function (res) {
                room.messages.push(res.data); //the new message
                deferred.resolve(res.data);
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    return services;
}
