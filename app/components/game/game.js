angular.module('myApp.game', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/game', {
        templateUrl:'components/game/game.html',
        controller:'GameController'
    })
}]);