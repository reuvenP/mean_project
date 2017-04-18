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
    vm.waiting_requests = roomsService.waiting_requests;
    vm.my_pending_rooms = roomsService.my_pending_rooms;
    vm.other_rooms = roomsService.other_rooms;
    vm.roomToAdd = '';
    vm.formatDateTime = pageService.formatDateTime;

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

    vm.addRoom = function() {
        pageService.clearAlert();
        roomsService.addRoom(vm.roomToAdd).then(
            function (res) {
                pageService.showAlert('Room added successfully', 'success', 'Success');
                roomsService.refreshRoomsLists();
                vm.roomToAdd = '';
            }, function (res) {
                pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
                vm.roomToAdd = '';
            }
        )
    };

    vm.confirm = function (userId, roomId) {
        pageService.clearAlert();
        roomsService.confirm(userId, roomId).then(
            function (res) {
                pageService.showAlert('Confirmed', 'success', 'Success');
                roomsService.refreshRoomsLists();
            }, function (res) {
                pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
            }
        )
    };

    roomsService.getMyRooms().then(
        function (res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showResponseError(res);
        }
    );
    roomsService.getMyPendingRooms().then(
        function (res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showResponseError(res);
        }
    );
    roomsService.getMyOtherRooms().then(
        function (res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showResponseError(res);
        }
    );
    roomsService.getWaitingRequests().then(
        function (res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showResponseError(res);
        }
    );

    pageService.setPageTitle('Rooms Management');
    $('#roomsLink').addClass('active');
}