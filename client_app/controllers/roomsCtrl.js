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

    vm.join_room = function (roomId) {
        pageService.clearAlert();
        roomsService.join_room(roomId).then(
            function (res) {
                pageService.showAlert('Your Request Has Been Sent', 'success', 'Success');
                roomsService.refreshRoomsLists();
            }, function (res) {
                pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
            }
        )
    };

    roomsService.getMyRooms();
    roomsService.getMyPendingRooms();
    roomsService.getMyOtherRooms();


    pageService.setPageTitle('Rooms Management');

}