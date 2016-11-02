angular.module('myApp', [
    'timer',
    'myApp.welcome',
    'myApp.words',
    'myApp.game',
    'myApp.result',
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}])
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

//save and get all results
var results = function($http) {
    var get = function() {
        return $http.get("https://guesstheword-ed9bc.firebaseio.com/Results.json").then(function(response) {
            return response.data;
        });
    };
    var save = function(results) {
        return $http.post("https://guesstheword-ed9bc.firebaseio.com/Results.json", results);
    }

    return {
        get: get,
        save: save
    }
}

angular.module('myApp')
.service('getPassObj', getPassObj)
.service('results', results);
//filter for top scores
var orderObjectBy = function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return b - a;
    });
    return array;
 }
};

angular.module('myApp')
.filter('orderObjectBy', orderObjectBy)
angular.module('myApp.welcome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl:'components/welcome/welcome.html',
        controller: 'WelcomeController'
    })
}]);
var WelcomeController = ['$scope', '$location', 'getPassObj', 'results', function($scope, $location, getPassObj, results) {
    
    //get all results
    results.get($scope.result).then(function(response) {
        $scope.allResults = response;
    });


    //Create name of player and pass to game controller
    $scope.startGame = function(name) {
        
        //set username in localstorage for simple authorization
        localStorage.username = name;
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
angular.module('myApp.game', ['ngRoute', 'timer'])
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


    //get word from words object, count max score for current word
    gameFactoryObj.getWord = function(newState) {
        var updatedState = newState;
        if(updatedState.words.length > 0) {


            if (!updatedState.scores) {
                updatedState.scores = 0;
            }

            var wordToGuess = updatedState.words[0].answer;
            var shuffledWord = updatedState.words[0].word;
            var wordLength = wordToGuess.length;
            
            updatedState.gameRunning = true;
            updatedState.wordScores = 0;
            updatedState.penalty = 0;
            updatedState.wordScores += Math.floor(Math.pow(wordLength / 3, 1.95));
            updatedState.words = updatedState.words;
            updatedState.wordToGuess = wordToGuess;
            updatedState.shuffledWord = shuffledWord;
            updatedState.answer = "";

            return updatedState
        }
    }


    //take next word 
    gameFactoryObj.nextWord = function(currentState) {
        var newState = currentState;
        if(currentState.answer.toUpperCase() == currentState.wordToGuess.toUpperCase()) {
            
            //set penalty for deleting chars
            if (currentState.wordScores < currentState.penalty) {
                newState.wordScores = 0;
            } else {
              newState.wordScores -= currentState.penalty;  
            }

            newState.scores += currentState.wordScores;
            newState.wordScores = 0;
            newState.words.shift();
            newState.answer = "";

            //newState is updated scope object without last word
            gameFactoryObj.getWord(newState); 

            return newState
        }
    }

    //save results in database
    gameFactoryObj.saveResults = function(results) {
        $http.post("https://guesstheword-ed9bc.firebaseio.com/Results.json", results);
    }


    return gameFactoryObj; 
};

angular.module('myApp.game')
.factory('gameFactory', gameFactory);
var GameController = ['$scope', '$http', '$location', 'gameFactory', 'getPassObj', function($scope, $http, $location, gameFactory, getPassObj) {

    // set username manually to get /game.html without setting username on homepage
    // $scope.username = "dev";


    //get username from localStorage
    $scope.username = localStorage.username;

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
            name: localStorage.username,
            scores: $scope.currentState.scores
        };

        //deleting localstorage to prevent start game from /game URL
        localStorage.removeItem("username");

        getPassObj.passObj(result);
        $location.path('/result');
        $scope.$apply();
    }
}];

angular.module('myApp.game')
.controller('GameController', GameController);
//scan for how many chars has been deleted in input
var answer = function() {
    return {
        restrict: 'EA',
        scope: false, 
        template: "<input id='answer-field' type='text' ng-model='currentState.answer' ng-show='currentState.gameRunning' class='form-control' focus-on='currentState.gameRunning' enter-click='next()' />",
        link: function(scope) {
            scope.$watch('currentState.answer', function(newValue, oldValue) {
                if(newValue && oldValue) {
                    if(oldValue.length > newValue.length) {
                        scope.currentState.penalty = scope.currentState.penalty + (oldValue.length - newValue.length);
                    }
                }
            });
        }
    }
};

//move to next word pressing "enter"
var enterClick = function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterClick);
                });

                event.preventDefault();
            }
        });
    };
};

//focus on input on start and after move to next word
var focusOn = function($timeout) {
    return {
        restrict : 'A',
        link : function($scope,$element,$attr) {
            $scope.$watch($attr.focusOn,function(_focusVal) {
                $timeout(function() {
                    _focusVal ? $element.focus() :
                        $element.blur();
                });
            });
        }
    }
}

angular.module('myApp.game')
.directive('answer', answer)
.directive('enterClick', enterClick)
.directive('focusOn', focusOn);
angular.module('myApp.result', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/result', {
        templateUrl:'components/result/result.html',
        controller:'ResultController'
    })
}]);
var ResultController = ['$scope', '$http', '$location', 'getPassObj', 'results', function($scope, $http, $location, getPassObj, results) {

    // set username manually to get /game.html without setting username on homepage
    // $scope.result = "dev";  
    
    //get username from welcome view
    $scope.result = getPassObj.getObj();

    //get all results
    var getResults = function(){
        results.get().then(function(response) {
            $scope.allResults = response;
        });
    };

    //save and get results
    results.save($scope.result).then(function(response){
        getResults();
    });


}];

angular.module('myApp.result')
.controller('ResultController', ResultController);