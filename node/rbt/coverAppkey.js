/* eslint-disable no-await-in-loop */
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const _ = require('lodash');

const emkey = Buffer.from('133947d8fa0f84d7', 'hex');
const encrypt = (buf) => {
  if (!buf) return '';
  const cipher = crypto.createCipheriv('des-cbc', emkey, emkey);
  cipher.setAutoPadding(true);
  const bfs = [];
  bfs.push(cipher.update(buf));
  bfs.push(cipher.final());
  return Buffer.concat(bfs);
};

const generate = (id) => {
  const ts = id.getTimestamp().getTime();
  const t1 = Buffer.from(ts.toString(16), 'hex');
  const t2 = Buffer.from(_.random(0x100, 0xfff).toString(16), 'hex');
  const orgin = Buffer.concat([t1, t2]);
  const k = encrypt(orgin);
  return k;
};

(async () => {
  const url = 'mongodb://127.0.0.1:27017';
  const client = await MongoClient.connect(url);
  const db = client.db('andrew');
  const clt = db.collection('stores');
  while(true) {
    const store = await clt.findOne({ appkey: { $exists: false } });
    if(!store) {
      break;
    }
    const id = store._id;
    const appkey = generate(id).toString('hex');
    const appsecret = generate(id).toString('hex');
    await clt.findOneAndUpdate({ _id: store._id }, { $set: { appkey, appsecret } });
  }
  client.close();
})();
