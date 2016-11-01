angular.module('myApp.welcome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl:'Welcome/welcome.html',
        controller: 'WelcomeController'
    })
}])