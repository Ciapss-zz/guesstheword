angular.module('myApp', [
    'myApp.welcome',
    'myApp.words',
    'myApp.game',
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);
//Service for passing objects between controllers
var getPassObj = function() {
    var obj;

    var passObj = function(newResult) {
        obj = newResult;
    };

    var getObj = function() {
        return obj;
    }

    return {
        passObj: passObj,
        getObj: getObj
    }
}

angular.module('myApp')
.service('getPassObj', getPassObj)
angular.module('myApp.welcome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl:'components/welcome/welcome.html',
        controller: 'WelcomeController'
    })
}]);
var WelcomeController = ['$scope', '$location', 'getPassObj', function($scope, $location, getPassObj) {

    //Create name of player and pass to other controller
     $scope.startGame = function(name) {
        getPassObj.passObj(name);
        $location.path('/game');
    }
}];

angular.module('myApp.welcome')
.controller('WelcomeController', WelcomeController);
angular.module('myApp.words', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/words', {
        templateUrl:'components/words/words.html',
        controller:'WordsController'
    })
}])
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
angular.module('myApp.game', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/game', {
        templateUrl:'components/game/game.html',
        controller:'GameController'
    })
}]);
var gameFactory = function($http) {

    //Method for shuffling array in random order of elements
    var shuffleArr = function(sourceArray) {
        for (var i = 0; i < sourceArray.length - 1; i++) {
            var j = i + Math.floor(Math.random() * (sourceArray.length - i));

            var temp = sourceArray[j];
            sourceArray[j] = sourceArray[i];
            sourceArray[i] = temp;
        }
        return sourceArray;
    }

    //Method for shuffling letters in words
    var shuffleWords = function(words) {
        var newWords = {};

        for(var w in words) {
            var wordObj = {};
            var length = words[w].name.length;
            var charsLeft = words[w].name;
            var shuffeledWord = "";

            //Method for shuffling letters in single word
            var shuffleChars = function() {
                for(var i = 0; i < length; i++) {
                    var currLength = charsLeft.length;
                    var charPos = Math.floor(Math.random() * currLength);

                    shuffeledWord += charsLeft.charAt(charPos);
                    charsLeft = charsLeft.slice(0, charPos) + charsLeft.slice(charPos + 1);
                }
            }

            shuffleChars();


            //check if shuffeled word is not the same as answer
            while(shuffeledWord == words[w].name) {
                shuffeledWord = "";
                charsLeft = words[w].name;
                shuffleChars();
            }

            wordObj["word"] = shuffeledWord.toUpperCase();
            wordObj["answer"] = words[w].name;

            newWords[w] = wordObj;
        }


        //changing object into array
        var tempArr = [];

        for (var prop in newWords) {
            tempArr.push(newWords[prop]);
        }

        newWords = shuffleArr(tempArr);

        console.log(newWords);

        return newWords;
    }

    //object with methods and variables of factory
    var gameFactoryObj = {};


    //get all words from Firebase
    gameFactoryObj.getWords = function() {
        return $http.get("https://guesstheword-ed9bc.firebaseio.com/Words.json").then(function(response) {
            return shuffleWords(response.data);
        });
    };


    return gameFactoryObj; 
};

angular.module('myApp.game')
.factory('gameFactory', gameFactory);
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