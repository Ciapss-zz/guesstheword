var GameController = ['$scope', '$http', '$location', 'gameFactory', 'getPassObj', function($scope, $http, $location, gameFactory, getPassObj) {

    // set username manually to get /game.html without setting username on homepage
    // $scope.username = "dev";


    //get username from homepage
    $scope.username = getPassObj.getObj();

    //Get all shuffeled words at start
    $scope.start = function() {
        var currentState = {};
        gameFactory.getWords().then(function(response) {
            currentState.words = response;
            $scope.currentState = gameFactory.getWord(currentState);
            document.getElementById('answer-field').focus();
            document.getElementById('timer-game')['start']();
        });
    }

    $scope.next = function() {
        gameFactory.nextWord($scope.currentState);
    }

    //finish game, save results and pass result object to results view
    $scope.finish = function() {
        var result = {
            name: $scope.username,
            scores: $scope.currentState.scores
        };

        getPassObj.passObj(result);
        $location.path('/result');
        $scope.$apply();
    }
}];

angular.module('myApp.game')
.controller('GameController', GameController);