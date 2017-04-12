/**
 * Created by reuvenp on 4/13/2017.
 */
angular.module('myApp').factory('roomsService', ['$http', '$q', '$rootScope', roomsService]);
function roomsService($http, $q, $rootScope) {
    var services = {};
    services.my_rooms = [];
    services.my_admin_rooms = [];
    services.my_pending_rooms = [];
    services.other_rooms = [];



    return services;
}