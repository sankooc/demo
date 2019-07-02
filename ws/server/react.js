const express = require('express');
const browserify = require('browserify');
const literalify = require('literalify');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const router   = express.Router();

router.get('/',function(req,res){
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

router.get('/bundle.js',function(req,res){
    res.setHeader('Content-Type', 'text/javascript');
    const option = {
        'socket': 'window.io',
        'react': 'window.React',
        'react-dom': 'window.ReactDOM'
    }
    browserify()
    .add(__dirname+'/component/app.js')
    .transform(literalify.configure(option))
    .bundle()
    .pipe(res);
})
module.exports =  router;
