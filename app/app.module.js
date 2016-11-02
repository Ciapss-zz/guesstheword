angular.module('myApp', [
    'timer',
    'myApp.welcome',
    'myApp.words',
    'myApp.game',
    'myApp.result',
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}])