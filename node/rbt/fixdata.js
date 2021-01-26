/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */
/* eslint-disable no-loop-func */
const mongoose = require('mongoose');
const { parse } = require('node-xlsx');
const XLSX = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');
const db = require('../libs/models');
const xls = require('../service/xls');
const stat = require('../service/stat');
const { ObjectId } = require('mongodb');
require('../prepare');


const fixOne = async (ts) => {
  for(const t of ts) {
    const { _id, tid, items, at } = t;
    const order = await db.Order.findById(_id);
    if(order && order.refundItems && order.refundItems.length) {
      const status = order.status;
      if(status === 7) continue;
      const refundItems = order.refundItems.toObject();
      // console.dir(order.refundItems.toObject());
      const m = {
        refundedAt: at, // 退款时间
        transaction: tid,
      };
      const total = -refundItems.reduce((l, c) => { return l += (c.refundp * c.amount) }, 0);
      // console.log(total);
      // console.log(items[0].amount);
      console.dir(tid);
      if(total === items[0].amount) {
        const items = refundItems.map(r => ({ ...r, ...m }));
        console.log(items);
      } else {
        console.log('--------');
        console.log(total, 'compute');
        console.log(items[0].amount, 'callback');
        console.log('order', _id);
        console.log('tran', tid);
      }
      // console.log(_id);
      // console.log(tid);
    }
  }
};

(async () => {
  const start = moment('2020-01-08').startOf('day').toDate();
  const end = moment('2019-10-01').startOf('day').toDate();
  const $match = {
    "data.result_code": "SUCCESS",
    amount: { $lt: 0 },
    at: {
      $gt: end,
      $lt: start,
    }
  };
  console.log(start, end);
  const $group = {
    _id: '$order',
    sum: { $sum: 1 },
    tid: { $first: '$_id' },
    at: { $first: '$at' },
    items: { $push: { amount: '$amount' } },
  };
  const pipes = [{ $match }, { $group }];
  pipes.push({
    $match: { sum: 1 },
  });
  const c = await db.Transaction.aggregate(pipes);
  console.log(c.length);
  await fixOne(c);
  mongoose.disconnect();
})();
