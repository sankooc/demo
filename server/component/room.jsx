import React from 'react';
import io from 'socket';
import reqwest from 'reqwest'
import {hashHistory} from 'react-router';
import _ from 'lodash'

function _socket(url,option){
    var socket = io(url);
    socket.on('connect', function() {
        socket.emit('sub', option);
        console.log('connected');
    });
    socket.on('disconnect', function() {
        console.log('disconnected');
    });
    return socket;
}

function _check(map,x,y){
    if(map && map[x]){
        return !!((1<<y)&map[x])
    }
    return false;
}

module.exports = React.createClass({
    getInitialState(){
        return {
            selected: {}
            ,select: {}
            ,pick: []
        }
    },
    componentDidMount() {
        const socket = _socket('http://localhost:3001',this.props.params);
        socket.on('movie/update',(info) =>{
            const state = this.state;
            state.selected = info;
            this.setState(state)
        });
    },
    _pick(x,y){
        var state = this.state.pick;
        return _.findIndex(state, {x,y});
    },
    _selected(x,y){
        var state = this.state.selected;
        return _check(state,x,y);
    },
    _cell_style(x,y){
        if(this._pick(x,y) >=0){
            return 'cell pick'
        }
        if(this._selected(x,y)){
            return 'cell selected';
        }
        return 'cell';
    },
    _toggle(event){
        const target = event.target;
        if(!target.classList.contains('cell')){
            return;
        }
        var x = parseInt(target.dataset.x);
        var y = parseInt(target.dataset.y);
        if(this._selected(x,y)){
            return;
        }
        var pick = this.state.pick;
        var inx = this._pick(x,y);
        if(inx>=0){
            pick.splice(inx, 1);
        }else{
            pick.push({x,y});
        }
        var state = this.state;
        this.setState(state)
    },
    _submit(){
        const data = _.pick(this.props.params,'uid','mid');
        data.items = this.state.pick;
        const option = {
            url: '/ticket',
            method: 'POST',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: () =>{
                var state = this.state;
                state.pick = [];
                this.setState(state)
            },
            error: function(){}
        }
        reqwest(option);
    },
    _clean(){
        const state = this.state;
        state.pick = [];
        this.setState(state);
    },
    render() {
        console.log('render');
        const {h,v} = this.props.meta;
        var _h = (100 / h) + '%';
        var _v = (100 / v) + '%';
        return <div className="container">
            <div className="row" style={{marginTop:"50px"}}>
                <div style={{width:"400px",height:"400px",margin:"auto",padding:"0"}} onClick={this._toggle}>
                    {
                        _.times(h,(i) =>{
                            return <div className="cell-row">
                            {
                                _.times(v,(j) =>{
                                    return <div className={this._cell_style(i+1,j+1)} data-x={i+1} data-y={j+1} style={{width:_h,height:_v}}></div>
                                })
                            }
                            </div>
                        })
                    }
                    <div>
                        <button className="btn btn-primary" onClick={this._submit}>预定</button>
                        <button className="btn btn-warning" onClick={this._clean}>重置</button>
                    </div>
                </div>

            </div>
        </div>;
    }
});
module.exports.defaultProps = {
    meta: {
        h: 10
        ,v: 10
    }
};
