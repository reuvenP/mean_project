/**
 * Created by reuvenp on 4/13/2017.
 */
angular.module('myApp').factory('webcamService', ['$http', '$q', '$rootScope', webcamService]);
function webcamService($http, $q, $rootScope) {
    var services = {};
    services.images = [];

    var getWebcams = function () {
        services.images.length = 0;
        var deferred = $q.defer();
        $http.get('/webcams/webcamsURL').then(
            function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    services.images[i] = res.data[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.getWebcams = getWebcams;

    return services;
}