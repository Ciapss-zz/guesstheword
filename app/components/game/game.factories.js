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