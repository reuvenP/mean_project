angular.module('myApp').factory('loginService', ['$http', '$q', 'pageService', loginService]);
function loginService($http, $q, pageService) {
    var services = {};

    services.login = function(username, hashedLogin, rememberMe) {
        var deferred = $q.defer();
        var req = {
            method: 'POST',
            url: '/login/enter',
            data: {username: username, hashedLogin: hashedLogin, rememberMe: rememberMe}
        };
        $http(req).then(
            function(res) {
                pageService.mainData.myUser = res.data;
                pageService.createSocket();
                deferred.resolve(res.data);
            },
            function(res) {
                deferred.reject(res);
            }
        );
        return deferred.promise;
    };

    services.logout = function() {
        pageService.closeSocket();
        var req = {
            method: 'GET',
            url: '/login/exit'
        };
        return $http(req);
    };

    services.getLoggedInUser = function() {
        var deferred = $q.defer();
        var req = {
            method: 'GET',
            url: '/login/getLoggedInUser'
        };
        $http(req).then(
            function (res) {
                pageService.mainData.myUser = res.data;
                pageService.createSocket();
                deferred.resolve(res.data);
            }, function (res) {
                deferred.reject(res);
            }
        );
        return deferred.promise;
    };

    services.forgotPassword = function(username) {
        var req = {
            method: 'GET',
            url: '/login/forgotPassword/' + username
        };
        return $http(req);
    };

    return services;
}
