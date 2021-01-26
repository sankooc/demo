const moment = require('moment');
const mongoose = require('mongoose');
require('../prepare');
const db = require('../libs/models');
const stat = require('../service/stat');

(async () => {
  // const { Transaction, Order } = db;
  // const date = '2020-03-01';
  // const norefund = true;
  // const start = moment(date).startOf('day').toDate();
  // const end = moment('2020-06-02').startOf('day').toDate();
  // const filter = { at: { $gt: start, $lt: end }, 'data.result_code' : 'SUCCESS' };
  // if(norefund) {
  //   filter.amount = { $lt: 0 };
  // }
  // const ts = await Transaction.find(filter).sort({ _id: 1 });
  // const count = ts.length;
  // console.log('total', count);
  // let inx = 0;
  // for (const t of ts) {
  //   inx += 1;
  //   if(inx % 400 === 0) console.log('count', inx);
  //   const { order, _id } = t;
  //   const ops = {
  //     payment: 'wechat',
  //   };
  //   ops.tid = _id.toString();
  //   {
  //     const c = await Order.countDocuments({ _id: order });
  //     if (c) {
  //       ops.order_version = 'base';
  //       await stat.shatter(ops);
  //       continue;
  //     }
  //   }
  // }
  // console.log('finish');

  try {
    const tid = '5ed3ba33f9bc6a594b01e130';
    const ops = { tid, order_version: 'base', payment: 'wechat' };
    await stat.shatter(ops);
  }catch(e) {
    console.error(e);
  }
  mongoose.disconnect();
})();
