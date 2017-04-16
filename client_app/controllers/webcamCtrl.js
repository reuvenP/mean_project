/**
 * Created by reuvenp on 4/13/2017.
 */
angular.module('myApp').controller('webcamController', ['$scope', 'pageService', 'webcamService', webcamController]);
function webcamController($scope, pageService, webcamService) {
    pageService.setPageTitle('Webcams');
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.images = webcamService.images;

    webcamService.getWebcams().then(
        function (res) {
            pageService.clearAlert();
        },
        function (res) {
            pageService.showResponseError(res);
        }
    )

}
