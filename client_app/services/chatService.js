angular.module('myApp').factory('chatService', ['$http', '$q', '$rootScope', 'roomsService', chatService]);
function chatService($http, $q, $rootScope, roomsService) {
    var services = {};
    services.rooms = roomsService.my_rooms;
    var socket = io();

    socket.on('send_msg', function(data){
        var room = services.getRoom(data.room);
        if (!room) return;
        $rootScope.$apply(function(){
            room.messages.push(data);
            $rootScope.$emit('new_msg', room._id);
        });
    });

    services.getRoom = function (roomId) {
        for (var i = 0; i < services.rooms.length; i++) {
            if (services.rooms[i]._id == roomId) {
                return services.rooms[i];
            }
        }
    };

    services.getMyRooms = function () {
        var promise = roomsService.getMyRooms();
        promise.then(function() {
            for (var i = 0; i < roomsService.my_rooms.length; i++) { //those rooms are referenced by services.rooms
                roomsService.my_rooms[i].messages = [];
            }
        });

        return promise;
    };

    var getLastOfflineMessages = function (roomId) {
        var deferred = $q.defer();
        $http.get('/chat/lastTwentyMessages/' + roomId).then(
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

    services.connectToRoom = function(roomId, scope, newMsgCallback) {
        var deferred = $q.defer();
        getLastOfflineMessages(roomId).then(
            function (res) {
                socket.emit('join', roomId);
                var handler = $rootScope.$on('new_msg', newMsgCallback);
                scope.$on('$destroy', handler);

                deferred.resolve();
                //otherwise:
                //deferred.reject(res);
            },
            function (res) {
                deferred.reject(res);
            }
        );
        return deferred.promise;
    };

    services.disconnectFromRoom = function(roomId) {
        var deferred = $q.defer();
        //TODO connect to socket.io channel, and in its success callback:
        services.getRoom(roomId).messages.length = 0;
        deferred.resolve();
        //otherwise:
        //deferred.reject(res);

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

    function replaceMessage(roomId, messageId, newMessage) {
        var messages = services.getRoom(roomId).messages;
        for(var i = 0; i < messages.length; i++) {
            if (messages[i]._id == messageId) {
                messages[i] = newMessage;
                return;
            }
        }
    }

    function updateVoteError(roomId, messageId, voteError) {
        var messages = services.getRoom(roomId).messages;
        for(var i = 0; i < messages.length; i++) {
            if (messages[i]._id == messageId) {
                messages[i].voteError = voteError;
                return;
            }
        }
    }

    services.likeMessage = function(messageId, roomId) {
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/chat/likeMessage/' + messageId
        };
        $http(req).then(
            function (res) {
                replaceMessage(roomId, messageId, res.data); //the updated message
                deferred.resolve(res.data);
            }, function (res) {
                updateVoteError(roomId, messageId, res.data);
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.dislikeMessage = function(messageId, roomId) {
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/chat/dislikeMessage/' + messageId
        };
        $http(req).then(
            function (res) {
                replaceMessage(roomId, messageId, res.data); //the updated message
                deferred.resolve(res.data);
            }, function (res) {
                updateVoteError(roomId, messageId, res.data);
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.sendMessageSocket = function (msg) {
        var room = services.getRoom(msg.room);
        if (!room) {
            return;
        }
        socket.emit('publish', {room: room._id, text: msg.text,
            link: msg.link, img: msg.img, isOnlyForConnected: msg.isOnlyForConnected });
    };

    services.joinRoom = function (roomId) {
        if (!roomId) {
            return;
        }
        socket.emit('join', roomId);
    };

    services.leaveRoom = function (roomId) {
        if (!roomId) return;
        socket.emit('leave', roomId);
        services.getRoom(roomId).messages.length = 0;
    };

    services.getAllMessages = function(roomId) {
        var promise = $http.get('/chat/allMessages/' + roomId);
        promise.then(function (res) {
            var messagesList = services.getRoom(roomId).messages;
            messagesList.length = 0;
            var loadedMessages = res.data;
            for (var i = 0; i < loadedMessages.length; i++) {
                messagesList[i] = loadedMessages[i];
            }
        });

        return promise;
    };

    return services;
}
