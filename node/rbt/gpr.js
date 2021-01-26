// const PROTO_PATH = '/Users/yj431/work/user-server/user-server.proto';

// const GRPCClient = require('node-grpc-client');

// const myClient = new GRPCClient(PROTO_PATH, 'user', 'userServer', '192.168.1.119:50052');

// const dataToSend = {
//   uidKey: 'storeidwyptest',
//   mobilePhone: '13521633088',
//   commonRequest: { version: 1, timestamp: `${Date.now()}`, requestId: 'requestid111111111111111' },
//   // service: 'test'
// };
// console.log(dataToSend);
// console.log('------------myClient ; ', myClient);

// myClient.createUserAsync(dataToSend, (err, res) => {
//   console.log('Service response >>>>>  ', res);
// });



// const 
// '021-52270228'
// 'http://api.yunjichina.com.cn/openapi/v1/task/summary/count'

const _ = require('lodash');
const crypto = require('crypto');
const request = require('request-promise');
const mongoose = require('mongoose');
const moment = require('moment');
require('../prepare');

const Store = require('../libs/models/Store');
const CronTimer = require('../libs/models/CronTimer');
const RobotTask = require('../libs/models/RobotTask');

const logger = require('../service/common').logger;

const creator = require('../service/cloud').create;

const appname = 'test';
const secret = 'df556ef607b8b583baa5e8b6afc5a205';
const prefix = 'http://api.yunjichina.com.cn';

// const time = () => new Promise((resolve) => { setTimeout(resolve, 1000); });
(async () => {
  const cfg = { appname, secret, prefix };
  const model = { Store, RobotTask, CronTimer };
  const service = creator(model, cfg);
  const store = '5d2d7c6f605f5857993a2413';
  const rs = await service.fetch(store, '2020-06-03 13:00:00');
  console.log(rs);
  mongoose.disconnect();
})();


// http://api.yunjichina.com.cn/openapi/v1/task/summary/count?placeIds=51480b6d7a344b6294700f834e09f75b&