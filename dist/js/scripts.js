angular.module('myApp', [
    'myApp.welcome',
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);
angular.module('myApp.welcome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl:'Welcome/welcome.html',
        controller: 'WelcomeController'
    })
}])
var WelcomeController = ['$scope', '$location', function($scope, $location) {
 
}];

angular.module('myApp.welcome')
.controller('WelcomeController', WelcomeController);