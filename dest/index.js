'use strict';

var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var dbserver = require('./db_server');

io.sockets.on('connection', function (client) {
    client.on('sub', function (meta) {
        var mid = meta.mid;
        var uid = meta.uid;

        var listen = function listen(info) {
            var result = {
                data: info.data,
                user: info.user[uid] || {}
            };
            client.emit('movie/update', result);
        };
        dbserver.on(mid, listen);
        client.on('disconnect', function () {
            dbserver.removeListener(mid, listen);
        });
        dbserver.status({ mid: mid }, function (err, info) {
            if (err) {
                console.trace(err.stack);
                return;
            }
            listen(info);
        });
    });
});

app.use(express.static(path.join(__dirname, '../asset')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/ticket', function (req, res) {
    var option = req.body;
    dbserver.batch(option, function (err) {
        if (err) {
            console.error(err);
            return res.status(400).end();
        }
        res.end();
    });
});

app.use('/', require('./react'));

server.listen(3001);