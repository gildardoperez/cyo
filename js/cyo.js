angular.module("cyo", [])

.directive("story", function() {
    return {
        restrict: "EA",
        controller: "StoryController",
    }
})

.directive("page", function() {
    return {
        restrict: "EA",
        scope: true,
        controller: "PageController",
    }
})

.directive("choice", function() {
    return {
        restrict: "EAC",
        controller: "ChoiceController",
    }
})

.directive("event", function() {
    return {
        restrict: "EA",
        // scope: true,
        controller: "EventController",
    }
})

.directive("condition", function() {
    return {
        restrict: "EA",
        controller: "ConditionController",
    }
})


.controller("StoryController", function($scope, $element) {
    $scope.storyEvents = [];
    $scope.choices = [];
    $scope.decisions = ['intro'];
})

.controller("PageController", function($scope, $attrs, $element) {

    $element.css("display", "none");

    $scope.pageName = Object.keys($attrs.$attr)[0];
    $scope.isComplete = false;

    $scope.$watch("decisions", function() {
        if ($scope.decisions.indexOf($scope.pageName) > -1) {
            $element.css("display", "block");
        }
    }, true);
})

.controller("ChoiceController", function($scope, $attrs, $element) {

    var choiceName = Object.keys($attrs.$attr)[0];

    angular.element($element).on("click", function() {
        $scope.isComplete = true;
        $scope.decisions.push(choiceName);
        $scope.$apply();
    });

    $scope.$watch("isComplete", function() {
        if ($scope.isComplete) {
            $element.css("display", "none");
        }
    }, true);
})


.controller("EventController", function($scope, $attrs) {
    var storyEvent = Object.keys($attrs.$attr);
    var isNegative = false;
    if (storyEvent[0] === "clear") {
        isNegative = true;
        storyEvent.shift();
    };

    var watchman = $scope.$watch("decisions", function() {
        if ($scope.decisions.indexOf($scope.pageName) > -1) {
            if ($scope.isCondition && !$scope.conditionValid) {
                console.log("this is in a condition that is not active");
                return;
            }
            console.log("Activating this event", storyEvent, !isNegative);
            if (!isNegative) {
                $scope.storyEvents.push(storyEvent[0]);
            } else {
                delete $scope.storyEvents[storyEvent[0]];
            }

            watchman();
        }
    }, true);
})

.controller("ConditionController", function($scope, $element, $attrs) {
    $element.attr("style", "display:none");
    var condition = Object.keys($attrs.$attr);
    var isNegative = false;

    $scope.isCondition = true;

    if (condition[0] === "unless" || condition[0] === "not") {
        isNegative = true;
        condition.shift();
    };

    var watchman = $scope.$watch("decisions", function() {
        if ($scope.decisions.indexOf($scope.pageName) > -1) {
            if ($scope.storyEvents.indexOf(condition[0]) > -1 && !isNegative) {
                $scope.conditionValid = true;
                $element.css("display", "block");
            } else if ($scope.storyEvents.indexOf(condition[0]) == -1 && isNegative) {
                $scope.conditionValid = true;
                $element.css("display", "block");
            }
            watchman();
        }
    }, true);
});
