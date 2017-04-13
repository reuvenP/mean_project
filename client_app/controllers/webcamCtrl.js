/**
 * Created by reuvenp on 4/13/2017.
 */
angular.module('myApp').controller('webcamController', ['$scope', 'pageService', webcamController]);
function webcamController($scope, pageService) {
    pageService.setPageTitle('Webcams');
    var vm = this;
    vm.mainData = pageService.mainData;
    vm.images = ['http://69.193.149.90:82/mjpg/video.mjpg?COUNTER', 'http://75.151.65.9/mjpg/video.mjpg?COUNTER']
}
