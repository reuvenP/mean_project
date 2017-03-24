angular.module('myApp').factory('loginService', ['$http', '$q', 'pageService', loginService]);
function loginService($http, $q, pageService) {
    var services = {};

    services.login = function(username, hashedLogin) {
        var req = {
            method: 'POST',
            url: '/login',
            data: {username: username, hashedLogin: hashedLogin}
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
