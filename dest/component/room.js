'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _socket2 = require('socket');

var _socket3 = _interopRequireDefault(_socket2);

var _reqwest = require('reqwest');

var _reqwest2 = _interopRequireDefault(_reqwest);

var _reactRouter = require('react-router');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _socket(url, option) {
    var socket = (0, _socket3.default)(url);
    socket.on('connect', function () {
        socket.emit('sub', option);
        console.log('connected');
    });
    socket.on('disconnect', function () {
        console.log('disconnected');
    });
    return socket;
}

function _check(map, x, y) {
    if (map && map[x]) {
        return !!(1 << y & map[x]);
    }
    return false;
}

module.exports = _react2.default.createClass({
    getInitialState: function getInitialState() {
        return {
            selected: {},
            select: {},
            pick: []
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        var socket = _socket('http://localhost:3001', this.props.params);
        socket.on('movie/update', function (info) {
            var state = _this.state;
            state.selected = info;
            _this.setState(state);
        });
    },
    _pick: function _pick(x, y) {
        var state = this.state.pick;
        return _lodash2.default.findIndex(state, { x: x, y: y });
    },
    _selected: function _selected(x, y) {
        var state = this.state.selected;
        return _check(state, x, y);
    },
    _cell_style: function _cell_style(x, y) {
        if (this._pick(x, y) >= 0) {
            return 'cell pick';
        }
        if (this._selected(x, y)) {
            return 'cell selected';
        }
        return 'cell';
    },
    _toggle: function _toggle(event) {
        var target = event.target;
        if (!target.classList.contains('cell')) {
            return;
        }
        var x = parseInt(target.dataset.x);
        var y = parseInt(target.dataset.y);
        if (this._selected(x, y)) {
            return;
        }
        var pick = this.state.pick;
        var inx = this._pick(x, y);
        if (inx >= 0) {
            pick.splice(inx, 1);
        } else {
            pick.push({ x: x, y: y });
        }
        var state = this.state;
        this.setState(state);
    },
    _submit: function _submit() {
        var _this2 = this;

        var data = _lodash2.default.pick(this.props.params, 'uid', 'mid');
        data.items = this.state.pick;
        var option = {
            url: '/ticket',
            method: 'POST',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function success() {
                var state = _this2.state;
                state.pick = [];
                _this2.setState(state);
            },
            error: function error() {}
        };
        (0, _reqwest2.default)(option);
    },
    _clean: function _clean() {
        var state = this.state;
        state.pick = [];
        this.setState(state);
    },
    render: function render() {
        var _this3 = this;

        console.log('render');
        var _props$meta = this.props.meta;
        var h = _props$meta.h;
        var v = _props$meta.v;

        var _h = 100 / h + '%';
        var _v = 100 / v + '%';
        return _react2.default.createElement(
            'div',
            { className: 'container' },
            _react2.default.createElement(
                'div',
                { className: 'row', style: { marginTop: "50px" } },
                _react2.default.createElement(
                    'div',
                    { style: { width: "400px", height: "400px", margin: "auto", padding: "0" }, onClick: this._toggle },
                    _lodash2.default.times(h, function (i) {
                        return _react2.default.createElement(
                            'div',
                            { className: 'cell-row' },
                            _lodash2.default.times(v, function (j) {
                                return _react2.default.createElement('div', { className: _this3._cell_style(i + 1, j + 1), 'data-x': i + 1, 'data-y': j + 1, style: { width: _h, height: _v } });
                            })
                        );
                    }),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-primary', onClick: this._submit },
                            '预定'
                        ),
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-warning', onClick: this._clean },
                            '重置'
                        )
                    )
                )
            )
        );
    }
});
module.exports.defaultProps = {
    meta: {
        h: 10,
        v: 10
    }
};