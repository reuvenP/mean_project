var app = angular.module('myApp', ['ngAnimate', 'ui.bootstrap', 'ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/login.html',
            controller: 'loginCtrl',
            controllerAs: 'login'
        })

        .when('/home/:operation?', {
            templateUrl: '/client_app/views/home.html',
            controller: 'homeCtrl',
            controllerAs: 'home'
        })

        .when('/users', {
            templateUrl: '/client_app/views/users.html',
            controller: 'usersController',
            controllerAs: 'users'
        })

        .when('/', {
            templateUrl: '/client_app/views/home.html',
            controller: 'homeCtrl',
            controllerAs: 'home'
        })

        .otherwise({
            redirect: '/'
        });
});

function findMainCtrl($scope) {
    while ($scope && (!$scope.main || $scope.main.constructor.name !== 'mainCtrl')) {
        $scope = $scope.$parent;
    }
    if ($scope) {
        return $scope.main;
    }
}
