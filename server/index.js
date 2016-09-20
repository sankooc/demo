var express = require('express')
var app = express();
var path = require('path')
// var session = require('express-session')({
//     resave: true,
//     saveUninitialized: true,
//     secret: 'secret'
// });
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var dbserver = require('./db_server');

io.sockets.on('connection', function(client){
    client.on('sub',function(meta){
        var mid = meta.mid;
        var listen = function(info){
            console.log('board');
            client.emit('movie/update',info);
        }
        dbserver.on(mid,listen);
        client.on('disconnect', function(){
            dbserver.removeListener(mid,listen);
        });
        dbserver.status({mid:mid},function(err,info){
            client.emit('movie/update',info);
        });
    })
});
app.use(express.static(path.join(__dirname, '../asset')));

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var http = require('http'),
    browserify = require('browserify'),
    literalify = require('literalify'),
    React = require('react'),
    ReactDOMServer = require('react-dom/server');

app.get('/',function(req,res){
    res.setHeader('Content-Type', 'text/html');
    var html = ReactDOMServer.renderToStaticMarkup(
        <html>
        <head>
            <link href="css/style.css" rel="stylesheet"/>
            <link href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"/>
            <link href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" rel="stylesheet"/>
        </head>
        <body>
        <div id="content"/>
        <script src="//cdn.bootcss.com/socket.io/1.4.8/socket.io.min.js"></script>
        <script src="//cdn.bootcss.com/react/15.3.1/react.min.js"></script>
        <script src="//cdn.bootcss.com/react/15.3.1/react-dom.min.js"></script>
        <script src="/bundle.js"/>
      </body></html>);
    res.end(html);
})

app.get('/bundle.js',function(req,res){
    res.setHeader('Content-Type', 'text/javascript');
    browserify()
      .add(__dirname+'/component/app.js')
      .transform(literalify.configure({
        'socket': 'window.io',
        'react': 'window.React',
        'react-dom': 'window.ReactDOM',
      }))
      .bundle()
      .pipe(res);
})

app.post('/ticket',function(req,res){
    const option = req.body;
    console.dir(option);
    dbserver.batch(option,function(){
        console.dir(arguments);
        res.end();
    });
});

server.listen(3001);
