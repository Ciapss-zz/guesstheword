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