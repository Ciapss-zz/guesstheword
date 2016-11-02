var ResultController = ['$scope', '$http', '$location', 'getPassObj', 'results', function($scope, $http, $location, getPassObj, results) {

    // set username manually to get /game.html without setting username on homepage
    // $scope.result = "dev";  
    
    //get username from welcome view
    $scope.username

    $scope.result = getPassObj.getObj();



    //get all results
    var getResults = function(){
        results.get().then(function(response) {
            $scope.allResults = response;
        });
    };

    //save and get results
    if($scope.result) {
        results.save($scope.result).then(function(response){
            getResults();
        });
    } else {
        $location.path('/');
    }



}];

angular.module('myApp.result')
.controller('ResultController', ResultController);