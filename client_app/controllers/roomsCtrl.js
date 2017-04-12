/**
 * Created by reuvenp on 4/13/2017.
 */
angular.module('myApp').controller('roomsController', ['$scope', 'pageService', 'roomsService', 'usersService', roomsController]);
function roomsController($scope, pageService, roomsService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.searchFilter = {};

    pageService.setPageTitle('Rooms Management');

    vm.rooms = chatService.rooms;
}