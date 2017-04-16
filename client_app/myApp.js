var app = angular.module('myApp', ['ngAnimate', 'ui.bootstrap', 'ngRoute', 'ngSanitize']);

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

        .when('/chat', {
            templateUrl: '/client_app/views/chat.html',
            controller: 'chatController',
            controllerAs: 'chat'
        })

        .when('/', {
            templateUrl: '/client_app/views/home.html',
            controller: 'homeCtrl',
            controllerAs: 'home'
        })

        .when('/rooms', {
            templateUrl: '/client_app/views/rooms.html',
            controller: 'roomsController',
            controllerAs: 'rooms'
        })

        .when('/webcam', {
            templateUrl: '/client_app/views/webcam.html',
            controller: 'webcamController',
            controllerAs: 'webcam'
        })

        .when('/search', {
            templateUrl: '/client_app/views/search.html',
            controller: 'searchCtrl',
            controllerAs: 'search'
        })

        .otherwise({
            redirect: '/'
        });
});

app.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';
});

(function (module) {

    var fileReader = function ($q, $log) {

        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    };

    module.factory("fileReader",
        ["$q", "$log", fileReader]);

}(angular.module('myApp')));

angular.module('myApp').directive("ngFileSelect", [ngFileSelect]);
function ngFileSelect(){
    return {
        link: function(scope, el) {
            el.bind("change", function(e){
                var file = (e.srcElement || e.target).files[0];
                scope.onFileSelection(file);
            });
        },
        scope: {
            onFileSelection: '='
        }
    }
}
