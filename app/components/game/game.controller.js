var GameController = ['$scope', '$http', 'gameFactory', function($scope, $http, gameFactory) {
    gameFactory.getWords().then(function(response) {
        $scope.words = response.data;
        console.log(response.data);
    });
}];

angular.module('myApp.game')
.controller('GameController', GameController);