var WelcomeController = ['$scope', '$location', 'getObj', function($scope, $location, getObj) {
     $scope.startGame = function(name) {
        getPassObj.passObj(name);
        $location.path('/game');
    }
}];

angular.module('myApp.welcome')
.controller('WelcomeController', WelcomeController);