angular.module('myApp').controller('mainCtrl', ['$scope', 'pageService', 'loginService', mainCtrl]);
function mainCtrl($scope, pageService, loginService) {
    var vm = this;
    vm.mainData = pageService.mainData;

    vm.clearAlert = function() {
        pageService.clearAlert();
    };

    $scope.$on('$locationChangeStart', function(event) {
        pageService.clearAlert();
    });

    loginService.getLoggedInUser().then(
        function (user) {
            if (window.location.href.split('#').length < 2) {
                gotoHome();
            }
        }
    );
}
