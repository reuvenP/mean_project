angular.module('myApp').controller('mainCtrl', ['$scope', 'pageService', 'loginService', 'usersService', mainCtrl]);
function mainCtrl($scope, pageService, loginService, usersService) {
    var vm = this;
    vm.mainData = pageService.mainData;

    vm.clearAlert = function() {
        pageService.clearAlert();
    };

    vm.logout = function() {
        loginService.logout().finally(
            function() {
                window.location.href  = "/";
            }
        )
    };

    vm.editMyUser = function () {
        var user = vm.mainData.myUser;
        if (!user) return;
        pageService.clearAlert();
        var modal = usersService.openUserEditModal(angular.copy(user));
        modal.then(function(userResult) {
            usersService.editUser(userResult).then(
                function (res) {
                    pageService.refreshMyUserIfNeeded(userResult);
                    pageService.showAlert('User updated successfully', 'success', 'Success');
                }, function (res) {
                    pageService.showAlert(res.status + ' - ' + res.statusText + ": " + (res.data.message || res.data.errmsg || res.data), 'danger', 'Error');
                }
            )
        });
    };

    $scope.$on('$locationChangeStart', function(event) {
        pageService.clearAlert();
        $('.sidebar-menu li').removeClass('active');
    });

    loginService.getLoggedInUser().then(
        function (user) {
            if (window.location.href.split('#').length < 2) {
                gotoHome();
            }
        }
    );
}
