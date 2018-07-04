MY_TOTAL_APP.service('myOptionsService', ['$rootScope', '$timeout', '$q', function ($rootScope, $timeout, $q) {
    var srv = this;

    srv.someFunction = function (input) {
        if (!input) {
            return "#.##";
        }
        return Math.round(input * 100) / 100;
    };
}]);