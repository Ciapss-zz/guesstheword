angular.module('myApp', [
    'myApp.welcome',
    'myApp.words',
    'myApp.game',
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);