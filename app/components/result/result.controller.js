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