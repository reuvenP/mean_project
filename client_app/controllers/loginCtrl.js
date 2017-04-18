angular.module('myApp').controller('loginCtrl', ['$scope', 'pageService', 'usersService', 'loginService', loginCtrl]);
function loginCtrl($scope, pageService, usersService, loginService){
    var vm = this;
    vm.mainData = pageService.mainData;
    pageService.setPageTitle('Login');
    vm.rememberMe = true; //default

    vm.login = function() {
        if (!vm.username) {
            return pageService.showAlert('Please enter username', 'warning');
        }
        var hash = CryptoJS.SHA1(vm.username + ':' + vm.password + ':' + vm.random);
        var hash_Base64 = hash.toString(CryptoJS.enc.Base64);
        loginService.login(vm.username, hash_Base64, vm.rememberMe).then(
            function(res) {
                pageService.setNextAlert($scope, 'Welcome ' + vm.mainData.myUser.name, 'info', 'Hello!');
                gotoHome();
            },
            function (res) {
                pageService.showAlert(res.data, 'danger', 'Login error');
            }
        );
    };

    vm.forgotPassword = function() {
        if (!vm.username) {
            return pageService.showAlert('Please enter username', 'warning');
        }
        loginService.forgotPassword(vm.username).then(
            function(res) {
                pageService.showAlert(res.data, 'info');
            }, function (res) {
                pageService.showAlert(res.data, 'danger');
            }
        );
    };

    vm.signup = function() {
        usersService.openUserEditModal().then(
            function (newUser) {
                newUser.isBlocked = true;
                usersService.addUser(newUser).then(
                    function () {
                        pageService.showAlert('User created successfully, but it is blocked until the admin approves it');
                    }, function (res) {
                        pageService.showAlert(res.data, 'danger');
                    }
                );
            }
        );
    }
}
