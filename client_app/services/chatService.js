angular.module('myApp').factory('chatService', ['$http', '$q', chatService]);
function chatService($http, $q) {
    var services = {};
    //var roomsMessages = [];
    //services.roomsMessages.push({roomId: 123, roomMessages: [{text: 'Hello 123!'}]});
    //services.roomsMessages.push({roomId: 456, roomMessages: [{text: 'Hello 456!'}]});

    services.rooms = [];

    services.getMessagesList = function (roomId) {
        for (var i = 0; i < services.rooms.length; i++) {
            if (services.rooms[i]._id == roomId) {
                return services.rooms[i].messages;
            }
        }
    };

    services.loadOfflineMessages = function (roomId) {
        var deferred = $q.defer();
        $http.get('/chat/roomsMessages').then(
            function (messages) {
                var messagesList = services.getMessagesList(roomId);
                messagesList.length = 0;
                for (var i = 0; i < messages.length; i++) {
                    messagesList[i] = messages[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.getRooms = function () {
        var deferred = $q.defer();
        $http.get('/chat/getRooms').then(
            function (rooms) {
                services.rooms = rooms;
                services.rooms.messages = [];
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    return services;
}
