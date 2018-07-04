var MY_TOTAL_APP = angular.module("myApp", ['ngDialog']);

MY_TOTAL_APP.controller('ctrlForTable', ['$scope', '$timeout', '$http', '$q', 'ngDialog', 'serviceForTabIndex',

    function ($scope, $timeout, $http, $q, ngDialog, serviceForTabIndex) {
        var vm = this;

        vm.pathTable = 'C://';
        vm.renderDataTable = [];
        vm.massOfButton = 0;
        vm.haveLinkOfDir = '';

        vm.currentTabMode = 'LOADING';

        vm.mainKeyDown = function (event, index, val, myIndex) {
            //debugger;

            if (event.keyCode == 115 && event.shiftKey) {
                //debugger;
                var path;
                if(val.typeOfFile != 'undefined'){
                    if (vm.pathTable == 'C://') {
                        if ((val.typeOfFile == 'file')) {
                            path = vm.pathTable;
                        }
                        if ((val.typeOfFile == 'folder')) {
                            path = vm.pathTable + val.renderFileName + '//';
                        }
                    } else {

                        if ((val.typeOfFile != '') || (val.typeOfFile == 'file')) {
                            path = vm.pathTable + '//';
                        }
                        if ((val.typeOfFile != '') || (val.typeOfFile == 'folder')) {
                            path = vm.pathTable + '//' + val.renderFileName + '//';
                        }

                    }
                    var nameFile = prompt('назовите ваш файл', 100);
                    var fileContentUri = '/makeNewFile' + '/' + encodeURIComponent(path) + '/' + nameFile;
                    var promise = $http.get(fileContentUri, {});
                    promise.then(function (response) {
                        console.log('The file was created!');
                    });
                }else{
                    alert('don\'t access');
                }
            }else{
                switch (event.keyCode) {
                    case 114: //f3 View
                        event.stopPropagation(); //cancelBubble = true;
                        event.preventDefault();
                        debugger;
                        vm.viewDocument(val);

                        break;
                    case 115: //f4 Edit

                        break;

                    case 116://f5 Copy
                        document.getElementById(0).focus();
                        break;

                    case 117://f6 Move
                        document.getElementById(1000000).focus();
                        break;

                    case 118://f7 New Folder
                        debugger;

                        if (val.typeOfFile == 'folder') {
                            var path;
                            if (vm.pathTable != 'C://') {
                                path = vm.pathTable + '//' + val.renderFileName;
                            } else {
                                path = vm.pathTable + val.renderFileName;
                            }
                            var promise = $http.post('/makeNewFolder', {newPath: path}, {});
                            promise.then(function (response) {
                                //window.open();                                          //??
                                alert('папку успешно созданна');

                            });
                        } else {
                            alert('создать файл можно только в папке');
                        }

                        break;

                    case 119://f8 Del
                        vm.pressDelete(event, index, val);
                        break;
                    /////
                    case 40: //bollDown
                        //debugger;
                        if (index + 1 < vm.renderDataTable.length && index >= 0) {
                            document.getElementsByName(myIndex + 1 + '')[0].focus();
                        }
                        break;
                    case 38: //bollUp
                        //debugger;
                        //event.target.attributes[1].nodeValue;
                        if (index >= 1) {
                            //document.getElementById(index - 1).tabIndex.focus();
                            document.getElementsByName(myIndex -1 + '')[0].focus();
                        }
                        break;

                    case 37://jumpToLeftTable
                        //debugger;
                        var length = serviceForTabIndex.getLengthMassTemplate();
                        if(myIndex >= length){
                            document.getElementsByName(0 + '')[0].focus();
                        }else{
                            document.getElementsByName(length + '')[0].focus();
                        }

                        break;

                    case 39://jumpToRightTable
                        //debugger;
                        var length = serviceForTabIndex.getLengthMassTemplate();
                        if(myIndex >= length){
                            document.getElementsByName(0 + '')[0].focus();
                        }else{
                            document.getElementsByName(length + '')[0].focus();
                        }
                        break;

                    case 13://enter
                        vm.pressEnter(myIndex, val);
                        break;

                    case 46://del
                        vm.pressDelete(event, index, val);
                        break;
                }
            }

        }



        vm.onHaveLinkOfDir = function (val) {
            //debugger;
            if (vm.pathTable == 'C://') {
                vm.haveLinkOfDir = vm.pathTable + val.renderFileName;
            } else {
                vm.haveLinkOfDir = vm.pathTable + '//' + val.renderFileName;
            }


        };

        vm.cleanLinkOfDir = function () {
            vm.haveLinkOfDir = '';
        };

        vm.tabElements = [/*{tabName: 'fuck'}, {tabName: 'beach'}*/];
        vm.onTabButtonClicked = function (selectedTabName) {
            vm.pathTable = selectedTabName;
            sendMessage();
            console.info('Select me: ' + selectedTabName);
        };

        vm.onCloseTabButtonClicked = function (removingTabId) {
            console.info('Remove me : ' + removingTabId);

            vm.tabElements = _.filter(vm.tabElements, function (tabObject) {
                return tabObject.tabId !== removingTabId;
            })
        };

        vm.onGetLinkOfDir = function () {

            if (vm.haveLinkOfDir != '') {
                //debugger;
                var memberOFButtonLink = vm.haveLinkOfDir;
                var nameFile = vm.haveLinkOfDir.substring(vm.haveLinkOfDir.lastIndexOf("//") + 2, vm.haveLinkOfDir.length);

                vm.tabElements.push({tabName: nameFile, tabAddress: vm.haveLinkOfDir, tabId: new Date().getTime()});

                vm.haveLinkOfDir = '';
            }

        };

        vm.onSendEnterInTable = function (val) {
            //debugger;
            if (val.typeOfFile == 'file') {
                vm.viewDocument(val);
            } else {
                if (val.renderFileName != 'UP') {//углубляемся в папку
                    if (vm.pathTable == 'C://') {
                        vm.pathTable += val.renderFileName;
                    } else {
                        vm.pathTable += '//' + val.renderFileName;
                    }
                } else {//выходим из нее
                    if ((vm.pathTable.lastIndexOf("//") != 2)) {
                        vm.pathTable = vm.pathTable.substring(0, vm.pathTable.lastIndexOf("//"));
                    } else
                        vm.pathTable = vm.pathTable.substring(0, vm.pathTable.lastIndexOf("//") + 2);
                }

                sendMessage();
            }

        };


        vm.responseInformation = '';
        $scope.div = document.body.children[2];


        vm.viewDocument = function (val) {
            //debugger;
            var path;
            if (vm.pathTable != 'C://') {
                path = vm.pathTable + '//' + val.renderFileName;
            } else {
                path = vm.pathTable + val.renderFileName;
            }

            var fileContentUri = '/view' + '/' + encodeURIComponent(path);
            if (val.renderFileName.indexOf(".png") > -1
                || val.renderFileName.indexOf(".jpg") > -1
                || val.renderFileName.indexOf(".gif") > -1) {

                vm.responseInformationUri = fileContentUri;
                vm.fileContentType = 'IMAGE';
                ngDialog.open({
                    template: 'fileContentHtmlTemplate.html',
                    closeByEscape: true,
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            } else {
                vm.fileContentType = 'TEXT';
                var promise = $http.get(fileContentUri, {});
                promise.then(function (response) {
                    ngDialog.open({
                        template: 'fileContentHtmlTemplate.html',
                        closeByEscape: true,
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    vm.responseInformation = response.data;
                });
            }


            vm.currentTabMode = 'FILE_CONTENT';
        }

        vm.pressEnter = function (myIndex, val) {
            //debugger
            var length = serviceForTabIndex.getLengthMassTemplate();
            vm.onSendEnterInTable(val);
            if (myIndex >= length) {
                document.getElementsByName(length + '')[0].focus();
            }
            if (myIndex < length) {
                document.getElementsByName(0 + '')[0].focus();
            }
        };
        vm.pressDelete = function (event, index, val) {
            if (val.renderFileName != 'UP') {
                debugger;
                var pathSend;
                if (vm.pathTable == 'C://') {
                    pathSend = vm.pathTable + val.renderFileName;
                } else {
                    pathSend = vm.pathTable + '//' + val.renderFileName;
                }
                var promise = $http.post('/del', {
                    newPathDel: pathSend,
                    typeOfFile: val.typeOfFile

                }, {});
                promise.then(function (response) {
                    sendMessage();
                });
            }
        };


        vm.backTable = function () {
            if (vm.pathTable.lastIndexOf("//") > 2) {
                vm.pathTable = vm.pathTable.substring(0, vm.pathTable.lastIndexOf("//"));
            } else {
                vm.pathTable = vm.pathTable.substring(0, vm.pathTable.lastIndexOf("//") + 2);
            }

            sendMessage();
        }
        vm.onSendMessTable = function () {
            sendMessage();
        };


        function sendMessage() {
            //debugger;
            var pathoftables = vm.pathTable;

            var promise = $http.post('http://localhost:8080/admin/send_path', {newPath: pathoftables}, {});
            promise.then(function (response) {
                vm.renderDataTable = [];
                if (vm.pathTable != 'C://') {
                    vm.renderDataTable[0] = {renderFileName: 'UP', typeOfFile: ''};
                    //debugger;
                    if (response.data.newPath != undefined) {
                        for (var i = 0; i < response.data.newPath.length; i++) {
                            vm.renderDataTable[i + 1] = {
                                renderFileName: response.data.newPath[i],
                                typeOfFile: response.data.massOfTypeFiles[i].characteristic
                            };
                        }
                    }
                } else {
                    //debugger;
                    for (var i = 0; i < response.data.newPath.length; i++) {
                        vm.renderDataTable[i] = {
                            renderFileName: response.data.newPath[i],
                            typeOfFile: response.data.massOfTypeFiles[i].characteristic
                        };
                    }
                }

                vm.currentTabMode = 'FOLDER_LIST';

            });
        }

        sendMessage();

        function _arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
    }

]);

MY_TOTAL_APP.directive('myRepeatDirective',['serviceForTabIndex', function(serviceForTabIndex) {
    return function(scope, element, attrs) {
        //debugger;
        var parent = $(element).parent().parent().parent().parent().parent()[0].attributes[1].nodeValue;
        var index = parseInt(attrs.myRepeatDirective);
        //debugger;
        scope.myIndex = serviceForTabIndex.getNextTabIndex(parent, index);

    };
}])
