/**
 * Created by reuvenp on 4/13/2017.
 */
angular.module('myApp').controller('roomsController', ['$scope', 'pageService', 'roomsService', 'usersService', 'chatService', roomsController]);
function roomsController($scope, pageService, roomsService, usersService, chatService) {
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.searchFilter = {};
    vm.pendingSearchFilter = {};
    vm.otherSearchFilter = {};
    vm.usersList = usersService.usersList;
    vm.my_rooms = roomsService.my_rooms;
    vm.my_admin_rooms = roomsService.my_admin_rooms;
    vm.my_pending_rooms = roomsService.my_pending_rooms;
    vm.other_rooms = roomsService.other_rooms;

    roomsService.getMyRooms();
    roomsService.getMyPendingRooms();
    roomsService.getMyOtherRooms();


    pageService.setPageTitle('Rooms Management');

}