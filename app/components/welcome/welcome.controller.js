var WelcomeController = ['$scope', '$location', 'getPassObj', 'results', function($scope, $location, getPassObj, results) {
    
    //get all results
    results.get($scope.result).then(function(response) {
        $scope.allResults = response;
    });


    //Create name of player and pass to game controller
    $scope.startGame = function(name) {
        getPassObj.passObj(name);
        $location.path('/game');
    }
}];

angular.module('myApp.welcome')
.controller('WelcomeController', WelcomeController);