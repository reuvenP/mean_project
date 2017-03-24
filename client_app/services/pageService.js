angular.module('myApp').factory('pageService', ['$http', '$q', pageService]);
function pageService($http, $q) {
    var services = {};
    services.mainData = {};

    function setAlert(alert, type, title) {
        services.mainData.alert = alert;

        if (type) {
            services.mainData.alertType = 'alert-' + type;
        }
        else {
            services.mainData.alertType = 'alert-info';
        }
        if (title) {
            services.mainData.alertTitle = title;
        }
        else {
            delete(services.mainData.alertTitle);
        }
    }

    services.setNextAlert = function($scope, alert, type, title) {
        $scope.$on('$locationChangeSuccess', function(event) {
            setAlert(alert, type, title);
        });
    };

    services.showAlert = function(alert, type, title) {
        setAlert(alert, type, title);
    };

    services.clearAlert = function() {
        delete(services.mainData.alert);
        delete(services.mainData.alertType);
        delete(services.mainData.alertTitle);
    };

    return services;
}
