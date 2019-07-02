'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = require('./login');
var Room = require('./room');

_reactDom2.default.render(_react2.default.createElement(
    _reactRouter.Router,
    { history: _reactRouter.hashHistory },
    _react2.default.createElement(_reactRouter.Route, { path: '/', component: Login }),
    _react2.default.createElement(_reactRouter.Route, { path: '/room/:mid/:uid', component: Room })
), document.getElementById('content'));