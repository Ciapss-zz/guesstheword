var WelcomeController = ['$scope', '$location', 'getPassObj', function($scope, $location, getPassObj) {

    //Create name of player and pass to other controller
     $scope.startGame = function(name) {
        getPassObj.passObj(name);
        $location.path('/game');
    }
}];

angular.module('myApp.welcome')
.controller('WelcomeController', WelcomeController);