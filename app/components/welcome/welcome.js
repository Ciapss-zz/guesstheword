angular.module('myApp.welcome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl:'components/welcome/welcome.html',
        controller: 'WelcomeController'
    })
}]);