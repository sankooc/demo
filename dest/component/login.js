'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Page = _react2.default.createClass({
    _toRoom: function _toRoom() {
        var _uid = this.uid.value;
        var _mid = this.mid.value;
        console.log(_mid);
        _reactRouter.hashHistory.push('/room');
    },
    render: function render() {
        var _this = this;

        return _react2.default.createElement(
            'div',
            { className: 'container' },
            _react2.default.createElement(
                'div',
                { className: 'row', style: { marginTop: "100px" } },
                _react2.default.createElement(
                    'div',
                    { className: 'col-md-offset-3 col-md-6' },
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'label',
                            { 'for': 'uid' },
                            '用户id'
                        ),
                        _react2.default.createElement('input', { ref: function ref(c) {
                                return _this.uid = c;
                            }, className: 'form-control', id: 'uid', placeholder: '用户id' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'form-group' },
                        _react2.default.createElement(
                            'label',
                            { 'for': 'mid' },
                            '电影id'
                        ),
                        _react2.default.createElement('input', { ref: function ref(c) {
                                return _this.mid = c;
                            }, className: 'form-control', id: 'mid', placeholder: '电影id' })
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'btn btn-default', onClick: this._toRoom },
                        'Submit'
                    )
                )
            )
        );
    }
});
module.exports = Page;