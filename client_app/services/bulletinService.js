/**
 * Created by reuvenp on 4/18/2017.
 */
angular.module('myApp').factory('bulletinService', ['$http', '$q', '$rootScope', bulletinService]);
function bulletinService($http, $q, $rootScope) {
    var services = {};
    services.bulletin = [];

    var getBulletin = function () {
        services.bulletin.length = 0;
        var deferred = $q.defer();
        $http.get('/bulletin/getBulletin').then(
            function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    services.bulletin[i] = res.data[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var refreshBulletin = function () {
        return getBulletin();
    };

    var join_room = function (roomId) {
        var deferred = $q.defer();
        $http.post('/rooms/join_room/' + roomId).then(
            function (res) {
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var addBulletin = function (msg) {
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/bulletin/addBullet',
            data: { msg: msg }
        };
        $http(req).then(
            function (res) {
                refreshBulletin().then(function () {
                    deferred.resolve(res.data);
                });
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.getBulletin = getBulletin;
    services.refreshBulletin = refreshBulletin;
    services.addBulletin = addBulletin;
    return services;
}