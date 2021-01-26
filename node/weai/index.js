const crypto = require('crypto');
const request = require('request');

const hash = signStr => crypto.createHash('md5').update(signStr).digest('hex');

const checksum = (key, time, base) => {
  const str = `${key}${time}${base}`;
  return hash(str);
};
exports.create = (cfg) => {
  const { appkey, appid, scene, timeout } = cfg;
  const handler = cfg.handler || function(){};
  const proc = (data, body) => {
    const jstr = JSON.stringify(data);
    const base = Buffer.from(jstr, 'utf-8').toString('base64');
    const ts = Math.round(Date.now() / 1000).toString();
    const sum = checksum(appkey, ts, base);
    const headers = {
      'X-Appid': appid,
      'X-CheckSum': sum,
      'X-CurTime': ts,
      'X-Param': base,
    };
    const opt = {
      url: 'http://openapi.xfyun.cn/v2/aiui',
      method: 'POST',
      headers,
      timeout,
      body,
      jsonReviver: (data) => {
        console.dir(data);
      }
      // json: true,
    };
    return new Promise((resolve, reject) => {
      request(opt, (err, resp, body) => {
        if(err){
          console.error(err);
          return reject(err);
        }
        let d;
        try {
          d = JSON.parse(body);
        } catch(e) {
          console.error(e);
          return reject(e);
        }
        resolve(d);
      });
    });
  };
  const text = (id, content) => {
    const data = {
      auth_id: id,
      data_type: 'text',
      scene,
    }
    const body = content;
    return proc(data, body);
  };
  const audio = (id, stream) => {
    const data = {
      aue: 'raw',
      sample_rate: '8000',
      auth_id: id,
      data_type: 'audio',
      scene,
    };
    const body = stream;
    return proc(data, body);
  };
  return { text, audio };
}