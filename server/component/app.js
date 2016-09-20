import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

const Login = require('./login')
const Room  = require('./room')

ReactDOM.render(<Router history={hashHistory}>
    <Route path="/" component={Login} />
    <Route path="/room/:mid/:uid" component={Room} />
  </Router>, document.getElementById('content'));
