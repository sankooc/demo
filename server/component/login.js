import React from 'react';
import {hashHistory} from 'react-router';

module.exports = React.createClass({
    _toRoom(){
        var _uid = this.uid.value;
        var _mid = this.mid.value;
        hashHistory.push('/room/'+_mid+'/'+_uid);
    },
    render() {
        return <div className="container">
            <div className="row" style={{marginTop:"100px"}}>
                <div className="col-md-offset-3 col-md-6">
                    <div className="form-group">
                        <label for="uid">用户id</label>
                        <input ref={(c) => this.uid = c}  className="form-control" id="uid" placeholder="用户id"/>
                    </div>
                    <div className="form-group">
                        <label for="mid">电影id</label>
                        <input ref={(c) => this.mid = c}  className="form-control" id="mid" placeholder="电影id"/>
                    </div>
                    <button className="btn btn-default" onClick={this._toRoom}>Submit</button>
                </div>
            </div>
        </div>;
    }
});
