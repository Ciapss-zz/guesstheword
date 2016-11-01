var gameFactory = function($http) {
    var gameFactoryObj = {};


    //get all words from Firebase
    gameFactoryObj.getWords = function() {
        return $http.get("https://guesstheword-ed9bc.firebaseio.com/Words.json").success(function(response) {
            return response.data;
        });
    };

    return gameFactoryObj; 
};

angular.module('myApp.game')
.factory('gameFactory', gameFactory);