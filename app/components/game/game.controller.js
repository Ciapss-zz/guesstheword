var GameController = ['$scope', '$http', 'gameFactory', function($scope, $http, gameFactory) {

    //Get all shuffeled words at start
    $scope.start = function() {
        var currentState = {};
        gameFactory.getWords().then(function(data) {
            currentState.words = data;
        });
    }
}];

angular.module('myApp.game')
.controller('GameController', GameController);