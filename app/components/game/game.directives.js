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