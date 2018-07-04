angular.module("myApp",[]).controller('mainCtrl', ['$scope', '$timeout', '$http', '$q', function ($scope, $timeout, $http, $q) {

    var s;
    /*function sendMessage(string) {
        //debugger;
        var path_of_tables;
        if(string == 'left_table'){
            path_of_tables = $scope.pathLeftTable;
        } else {
            path_of_tables = $scope.pathRightTable;
        }
        var promise = $http.post('/send_path', {newPath: path_of_tables, which_of_tables: string}, {});
        promise.then(function (response) {
            //debugger;
            if(response.data.which_of_tables == 'left_table'){
                $scope.renderDataForLT = response.data.massOfFiles;
            } else{
                $scope.renderDataForRT = response.data.massOfFiles;
            }
            //debugger;

            console.log(response);
        });
    }

    sendMessage('left_table');
    sendMessage('right_table');*/


}]);