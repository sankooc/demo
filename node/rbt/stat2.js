const request = require('request');
const _ = require('lodash');
const crypto = require('crypto');

const appname = 'test';
const secret = 'df556ef607b8b583baa5e8b6afc5a205';


const data = {
  count: 10,
  start: 0,
};
const api = 'https://api-test.yunjichina.com.cn/openapi/v1/ctrip/scenicspot/query';

const ts = new Date().getTime();
const _data = {
  // start: '0',
};
const tt = Object.assign({}, { appname, secret, ts }, _data);
const keys = Object.keys(tt).sort();
const strSign = keys.map((k) => {
  const v = tt[k];
  if(typeof v === 'object') {
    return `${k}:${JSON.stringify(v)}`;
  } else {
    return `${k}:${v}`;
  }
}).join('|');
const sign = crypto
  .createHash('md5')
  .update(strSign)
  .digest('hex');
const data1 = _.omit(tt, 'secret');
data1.sign = sign;

const option = {
  url: api,
  method: 'POST',
  headers: { 'contaent-type': 'application/json' },
  body: data1,
  // json: true,
};
request(option, (err, r, body) => {
  console.log(body);
});
