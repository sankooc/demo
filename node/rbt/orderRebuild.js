/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs');

require('../prepare');

const db = require('../libs/models');
const Position = require('../libs/models/Position');
const oservice = require('../libs/services/orderStatisticsService');
const stat = require('../service/stat');
const xls = require('../service/xls');

const rolls = async (ts) => {
  let len = ts.length;
  console.log('transactions', ts.length);
  for (const t of ts) {
    if (len % 150 === 0) {
      console.log('exists', len);
    }
    len -= 1;
    const { order, user, amount, _id, data, at } = t;
    const ops = {
      payment: '微信支付',
      // user_id: (user || '').toString(),
      // currency: 'CNY',
      // order_version: 'base',
      // payment_at: at,
      // amount,
      // order_id: order.toString(),
    };
    ops.tid = _id.toString();
    // ops.transaction = data.transaction_id;
    // if(data.refund_id) {
    //   ops.refund_id = data.refund_id;
    //   ops.status = 'refund';
    // } else {
    //   ops.payment_id = ops.transaction;
    //   ops.status = 'pay';
    // }
    // await stat.read(ops);


    {
      const c = await db.Order.countDocuments({ _id: order });
      if (c) {
        ops.order_version = 'base';
        await stat.shatter(ops);
        continue;
      }
    }
    {
      const c = await db.OrderMaster.countDocuments({ _id: order });
      if (c) {
        console.log('--master--');
        ops.order_version = 'master';
        await stat.shatter(ops);
        continue;
      }
    }
    // throw new Error('unexpect');
  }
  // console.log(ts.length);
};

const fin = async () => {
  // const start = moment('2019-12-19').startOf('day').toDate();
  // const end = moment('2019-11-20').endOf('day').toDate();
  // const end = moment('2019-12-29').endOf('day').toDate();
  // const start = moment('2019-12-29 00:00:00').startOf('day').toDate();
  const start = moment('2020-01-07 00:00:00').startOf('day').toDate();
  const end = moment('2020-01-08 00:00:00').startOf('day').toDate();
  const checkpoint = 'pay'; // order

  console.time('parseData');
  const data = await stat.order({ start, end, checkpoint });
  console.timeEnd('parseData');

  const file = '/Users/yj431/demo.xlsx';
  if (fs.existsSync(file)) fs.unlinkSync(file);
  console.time('createFile');
  await xls.finance(data, file);
  console.timeEnd('createFile');
};


const fin2 = async () => {
  // const start = moment('2019-12-19').startOf('day').toDate();
  // const end = moment('2019-11-20').endOf('day').toDate();
  // const end = moment('2019-12-29').endOf('day').toDate();
  const start = moment('2019-12-29 00:00:00').startOf('day').toDate();
  const end = moment('2020-01-08 00:00:00').startOf('day').toDate();
  const checkpoint = 'pay'; // order

  console.time('parseData');
  const data = await stat.settles({ start, end, checkpoint });
  console.timeEnd('parseData');

  // console.dir(data);
  const file = '/Users/yj431/demo.xlsx';
  if (fs.existsSync(file)) fs.unlinkSync(file);
  console.time('swap');
  const wb = await xls.settles(data);
  console.timeEnd('swap');
  console.time('createFile');
  const buf = await xls.toStream(wb, 'buffer');
  fs.writeFileSync(file, buf);
  console.timeEnd('createFile');
  // const file = '/Users/yj431/demo.xlsx';
  // if(fs.existsSync(file)) fs.unlinkSync(file);
  // console.time('createFile');
  // await xls.finance(data, file);
  // console.timeEnd('createFile');
};



const demo = async () => {
  const express = await stat.expressions({ valid: true });
  const wb = xls.exprTest(express.items);

  const file = '/Users/yj431/demo.xlsx';
  if (fs.existsSync(file)) fs.unlinkSync(file);
  // const out = fs.createWriteStream(file);
  const buf = await xls.toStream(wb, 'buffer');
  fs.writeFileSync(file, buf);
};
(async () => {
  // await fin2();
  // await demo();
  // for(const n of nums) {
  //   if(nnn.indexOf(n) < 0){
  //     console.log(n);
  //   }
  // }
  // const start = moment().add(-90, 'days').startOf('day').toDate();
  // const end = moment().add(-40, 'days').startOf('day').toDate();
  const start = moment('2020-04-02 00:00:00').startOf('day').toDate();
  const end = moment('2020-04-03 00:00:00').startOf('day').toDate();
  const ts = await db.Transaction.find({ at: { $gt: start, $lte: end }, 'data.result_code' : 'SUCCESS' }).sort({ at: 1 });
  await rolls(ts);
  mongoose.disconnect();
})();
