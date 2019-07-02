'use strict';

var express = require('express');
var browserify = require('browserify');
var literalify = require('literalify');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var router = express.Router();

router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    var html = ReactDOMServer.renderToStaticMarkup(React.createElement(
        'html',
        null,
        React.createElement(
            'head',
            null,
            React.createElement('link', { href: 'css/style.css', rel: 'stylesheet' }),
            React.createElement('link', { href: '//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css', rel: 'stylesheet' }),
            React.createElement('link', { href: '//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css', rel: 'stylesheet' })
        ),
        React.createElement(
            'body',
            null,
            React.createElement('div', { id: 'content' }),
            React.createElement('script', { src: '//cdn.bootcss.com/socket.io/1.4.8/socket.io.min.js' }),
            React.createElement('script', { src: '//cdn.bootcss.com/react/15.3.1/react.min.js' }),
            React.createElement('script', { src: '//cdn.bootcss.com/react/15.3.1/react-dom.min.js' }),
            React.createElement('script', { src: '/bundle.js' })
        )
    ));
    res.end(html);
});

router.get('/bundle.js', function (req, res) {
    res.setHeader('Content-Type', 'text/javascript');
    var option = {
        'socket': 'window.io',
        'react': 'window.React',
        'react-dom': 'window.ReactDOM'
    };
    browserify().add(__dirname + '/component/app.js').transform(literalify.configure(option)).bundle().pipe(res);
});
module.exports = router;