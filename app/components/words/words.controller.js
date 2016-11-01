var WordsController = ['$scope', '$http', 'gameFactory', function($scope, $http, gameFactory) {
    
    //get all words from Firebase
    $http.get("https://guesstheword-ed9bc.firebaseio.com/Words.json").then(function(response) {
        $scope.words = response.data;
    });

    //Add new word to Firebase
    $scope.addWord = function(name) {
        var newWord = {
            name: name
        };
        $http.post("https://guesstheword-ed9bc.firebaseio.com/Words.json", newWord).then(function(response) {
            $scope.name = "";
        });
    };
}];

angular.module('myApp.words')
.controller('WordsController', WordsController);