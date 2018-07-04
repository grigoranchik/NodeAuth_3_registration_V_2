MY_TOTAL_APP.service('serviceForTabIndex', ['$rootScope', '$timeout', '$q', function ($rootScope, $timeout, $q) {
    var srv = this;
    srv.massForFirstTemplate = [];
    srv.massForSecondTemplate = [];

    for(var i=0; i< 500000; i++){
        srv.massForFirstTemplate[i] = i;
        srv.massForSecondTemplate[i] = i + 500000;
    }

    srv.getLengthMassTemplate = function(){
        return srv.massForSecondTemplate.length;
    }

    srv.getNextTabIndex = function (parent, index) {
        //debugger;
        if(parent == 'firstTemplate'){
            return srv.massForFirstTemplate[index];
        }
        if(parent == 'secondTemplate'){
            return srv.massForSecondTemplate[index];
        }


    }

    console.info("Service created.")
}]);