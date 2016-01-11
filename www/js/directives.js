angular.module('app.directives', [])

.directive('equalsTo', [function () {
    /*
     * <input type="password" ng-model="Password" />
     * <input type="password" ng-model="ConfirmPassword" equals-to="Password" />
     */
    return {
        restrict: 'A', // Use only as attribute
        scope: true,
        require: 'ngModel',
        link: function (scope, elem, attrs, control) {
            var check = function () {
                var v1 = scope.$eval(attrs.ngModel); // attrs.ngModel = "ConfirmPassword"                   
                var v2 = scope.$eval(attrs.equalsTo).$viewValue; // attrs.equalsTo = "Password"
                return v1 == v2;
            };
            scope.$watch(check, function (isValid) {
                control.$setValidity("equalsTo", isValid);
            });
        }
    };

// .directive('blankDirective', [function(){

}]);

