var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/static/json/myJson.JSON', function (req, res) {
    fs.readFile("OnlyAdminPages/json/myJson.JSON", "utf8",
        function(error,data){
            if(error) throw error; // если возникла ошибка
            var myObj = data;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(myObj);
        });
});

router.use('/static', express.static('OnlyAdminPages'));

router.post('/static/regress_json', jsonParser,  function (req, res) {

    fs.writeFile("OnlyAdminPages/json/myJson.JSON", req.body.myJson, function(error){
        if(error) throw error; // если возникла ошибка
        res.end('ok!');
    });
});

router.get('/', function (req, res) {
    //страница доступна только для админа
    if (req.session.username == 'admin') {
        console.log(req.session.username + ' requested admin page');
        res.render(path.join('admin_page'));//пользователю возвращаем представление "admin_page"

    } else {
        res.status(403).send('Access denied!');
    }
});

router.post('/send_path', function (req, res) {
    function objectSend(nameOfFile, characteristic) {
        this.nameOfFile = nameOfFile;
        this.characteristic = characteristic;
    };
    // var objectSend = new objectSEnd((massOfFiles, which_of_tables);
    var massOfTypeFiles=[];

    fs.readdir(req.body.newPath, function(err, items) {
        var strPath = '';
        if(req.body.newPath == 'C://'){
            strPath = req.body.newPath;
        } else{
            strPath = req.body.newPath +'//';
        }
        //console.log('strPath=', strPath,'items[0]=', items[0]);
        if (items != undefined){

            var i =0;
            var recFunc = function () {
                if(i<items.length){
                    fs.stat(strPath + items[i], function(err, stats) {
                        if(stats == undefined){
                            massOfTypeFiles[i] = new objectSend(items[i], 'undefined');
                        } else{
                            if(stats.isFile() == true){
                                massOfTypeFiles[i] = new objectSend(items[i], 'file');
                            } else{
                                massOfTypeFiles[i] = new objectSend(items[i], 'folder');
                            }

                        }
                        i++;
                        recFunc();
                    });
                } else{
                    res.send({newPath: items, massOfTypeFiles: massOfTypeFiles});
                    return 0;
                }

            }
            recFunc();
            //massSend.join('/n');

        } else {
            var it = [];    //если папка пустая оправляем пустой массив
            res.send(it);
        }
    });

});

/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rabbit for admin' });
});

router.get('/mack', function(req, res, next) {
    //res.send('Express my mackrabbit');
    res.render('index', { title: 'mackrabbit for admin' });
});*/

module.exports = router;
