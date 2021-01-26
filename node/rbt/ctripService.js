/* eslint-disable prefer-object-spread */
const request = require('request');
const crypto = require('crypto');
const _ = require('lodash');

const swap = (option) => new Promise((resolve, reject) => {
  request(option, (err, response, body) => {
    if (err) {
      reject(err);
      console.error(err);
      return;
    }
    if (response.statusCode !== 200) {
      reject(response.body);
      console.error(body);
      return;
    }
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.trace(e);
    }
    resolve(body);
  });
});

const post = (url, data, headers = {}) => {
  return swap({ method: 'post', url, json: data, headers });
};

const put = (url, data, headers = {}) => {
  return swap({ method: 'put', url, json: data, headers });
};

const get = (url, qs = {}) => {
  return swap({ url, qs });
};
const del = (url, qs) => {
  return swap({ method: 'delete', url, qs });
};


const hash = (str, encode = 'hex', algo = 'md5') => crypto.createHash(algo).update(str).digest(encode);

exports.craete = (cfg) => {
  const { appname, secret, prefix } = cfg;


  const scenicspots = async (opt) => {
    const ts = 1566822752820;
    const base = { appname, secret };
    const obj = Object.assign({}, base, opt, { ts });
    const keys = Object.keys(opt).sort();
    const extra = Object.keys(Object.assign({}, base, { ts }));
    keys.push(...extra);
    const toSignStr = keys.map((key) => {
      const v = obj[key];
      if(typeof v === 'object') {
        return `${key}:${JSON.stringify(v)}`;
      }
      return `${key}:${v}`;
    }).join('|');
    const sign = hash(toSignStr);
    const data = _.omit(_.pick(obj, ...keys), 'secret');
    data.sign = sign;
    console.log(data);
    // console.log(sign);
    // console.log(toSignStr);
  };
  return { scenicspots };
};
