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
            console.log(results);
            return $http.post("https://guesstheword-ed9bc.firebaseio.com/Results.json", results).then(function(response) {
                return console.log('save: ' + response);
            });
    }

    return {
        get: get,
        save: save
    }
}

angular.module('myApp')
.service('getPassObj', getPassObj)
.service('results', results);