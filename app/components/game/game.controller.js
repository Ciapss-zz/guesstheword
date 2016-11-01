var GameController = ['$scope', '$http', 'gameFactory', function($scope, $http, gameFactory) {

    //Get all shuffeled words at start
    $scope.start = function() {
        var currentState = {};
        gameFactory.getWords().then(function(data) {
            currentState.words = data;
            $scope.currentState = gameFactory.getWord(currentState);
            document.getElementById('answer-field').focus();
        });
    }

    $scope.next = function() {
        gameFactory.nextWord($scope.currentState);
    }
}];

angular.module('myApp.game')
.controller('GameController', GameController);