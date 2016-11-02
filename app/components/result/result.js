angular.module('myApp.result', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/result', {
        templateUrl:'components/result/result.html',
        controller:'ResultController'
    })
}]);