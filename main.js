var fs = require('fs');
var express = require('express');
var app = express();
var cons = require('consolidate');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

app.use(bodyParser.json());

var port = 8080;

//зарегистрированные пользователи, которые могут быть авторизированны
var users = [
    {username: 'admin', password: '12345'},
    {username: 'foo', password: 'bar'},
    {username: 'user', password: 'test'}
];

//создание хранилища для сессий
var sessionHandler = require('./js/session_handler');
var store = sessionHandler.createStore();

//app.use(express.cookieDecoder());
//app.use(express.session());

//регистрируем промежутчный обработчик, чтобы парсить кукисы
app.use(cookieParser());

//создание сесии
app.use(session({
    store: store,
    resave: false,
    saveUninitialized: true,
    secret: 'supersecret'
}));

app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/upload', function(req, res){
    // Render page with upload form
    res.sendFile('C:/Users/grigory/Desktop/work/NodeAuth_3_registration/src/image-0-02-04-af051f1cd15cfd21ce4b9ea040f81cc5791c0489f483090e6d83e95efa12419e-V.jpg');
    //res.render('admin_fone');
});

app.post('/login', function (req, res) {

    var foundUser;
    //поиск пользователя в массиве users
    for (var i = 0; i < users.length; i++) {
        var u = users[i];
        if (u.username == req.body.username && u.password == req.body.password) {
            foundUser = u.username;
            break;
        }
    }
    if (foundUser !== undefined) {
        req.session.username = foundUser;
        console.log('Login succeeded: ', req.session.username);
        if (req.session.username == 'admin') {
            console.log(req.session.username + ' requested admin page');
            res.end('admin');
        } else {
            console.log(req.session.username + ' requested user page');
            res.end('user');
        }

    } else{
        console.log('Login failed:', req.body.username);
        res.status(401).send('Login error');
    }

        //res.send('Login successful' + 'sessionID ' + req.session.id + '; user: ' + req.session.username);
});

app.post('/registration', function (req, res) {
    var foundUser;
    //поиск пользователя в массиве users
    for (var i = 0; i < users.length; i++) {
        var u = users[i];
        if (u.username == req.body.username && u.password == req.body.password) {
            foundUser = u.username;
            res.send('This name are used...');
            break;
        }
    }
    if (foundUser == undefined) {
        users.push({username: req.body.username, password: req.body.password});
        for (var i = 0; i < users.length; i++) {
            console.log(users[i].username, users[i].password);
        }
        res.send('Registration successful');
    } else {
        console.log('Login failed:', req.body.username);
        res.status(401).send('Login error');
    }
});

app.get('/logout', function (req, res) {

    delete req.session.authenticated;
    //req.session.username = '';
    console.log('logger out');
    res.send('logger out!');
});

//ограничение доступа к контенту на основе авторизации
app.use('/admin', adminRouter);
app.use('/users', usersRouter);

/*app.get('/admin', function (req, res) {
    //страница доступна только для админа
    if (req.session.username == 'admin') {
        console.log(req.session.username + ' requested admin page');
        res.render(path.join('admin_page'));//пользователю возвращаем представление "admin_page"

    } else {
        res.status(403).send('Access denied!');
    }
});

app.post('/send_path', function (req, res) {
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

app.get('/user', function (req, res) {
    //страница доступна только для залогиненного пользователя
    //console.log("req.session.username: " + req.session.username);
    if (req.session.username.length > 0) {
        console.log(req.session.username + ' requested user page');
        res.render(path.join('user_page'));
    } else {
        res.status(403).send('Access Denied!');
    };
});

app.get('/user/play', function (req, res) {
    res.render(path.join('piatnashki'));
    console.log(req.body);

});*/

app.get('/guest', function (req, res) {
    //страница для гостей(без ограничения доступа)
    res.render(path.join('guest_page'));
});

/*
app.get('/check', function(req, res) {
    if(req.session.username){
        res.set('Content-Type', 'text/html');
        res.send('<h2>user ' + req.session.username + ' is logged in! </h2>')
    } else{
        res.send('not logged in');
    }
});
*/
app.listen(port, function () {
    console.log('app running on port: ' + port);
});