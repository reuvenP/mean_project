angular.module('myApp').controller('usersController', ['$scope', 'pageService', 'usersService', usersController]);
function usersController($scope, pageService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.usersList = usersService.usersList;

    usersService.refreshUsers().then(
        function (res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
        }
    );

    vm.deleteUser = function (user) {
        //TODO modal confirm box
        usersService.deleteUser(user._id).then(
            function (res) {
                pageService.showAlert('User deleted successfully', 'success', 'Success');
            },
            function (res) {
                pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
            }
        );
    };

    vm.addUser = function() {
        var modal =  usersService.openUserEditModal(); //new user
        modal.then(function(user) {
            usersService.addUser(user).then(
                function (res) {
                    pageService.showAlert('User added successfully', 'success', 'Success');
                }, function (res) {
                    pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
                }
            )
        });
    };

    vm.editUser = function (user) {
        var modal = usersService.openUserEditModal(angular.copy(user));
        modal.then(function(userResult) {
            usersService.editUser(userResult).then(
                function (res) {
                    pageService.showAlert('User updated successfully', 'success', 'Success');
                }, function (res) {
                    pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
                }
            )
        });
    };
}
