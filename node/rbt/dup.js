/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs');

require('../prepare');

const db = require('../libs/models');
const xls = require('../service/xls');

const { Order } = db;
// const dup = async (start, end) => {
//   { $match: { status: { $ne: 1 } } }, { $group: { _id: "$user", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $group: { _id: null, total: { $sum:1 } } } }
// };

const position = async (option) => {
  const pipes = [{ $match: option }];
  pipes.push({ $group: { _id: "$position", count: { $sum:1 }, total: { $sum: "$p" } } });
  // pipes.push({ $sort: { count: -1 } });
  pipes.push({
    $lookup: {
      from: 'positions',
      localField: '_id',
      foreignField: '_id',
      as: 'position'
    }
  });
  pipes.push({
    $unwind: '$position'
  });
  pipes.push({
    $project: {
      count: 1,
      total: 1,
      t: '$position.t',
      d: '$position.d',
      store: '$position.store',
    }
  });
  pipes.push({
    $lookup: {
      from: 'stores',
      localField: 'store',
      foreignField: '_id',
      as: 'store'
    }
  });
  pipes.push({
    $unwind: '$store'
  });
  pipes.push({
    $project: {
      count: 1,
      total: 1,
      t: 1,
      d: 1,
      store_t: '$store.t',
    }
  });
  pipes.push({
    $sort: { count: -1 },
  });
  const datas = await Order.aggregate(pipes);
  // console.log(datas);
  const wb = xls.points(datas);
  const file = '/Users/yj431/dianwei.xls';
  wb.write(file, (err, st) => {});
};

const tw = async (option, file) => {
  if(fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
  const pipes = [{ $match: option }];
  pipes.push({ $group: { _id: '$user', total: { $sum: '$p' }, count: { $sum: 1 }, stores: { $addToSet: '$store' }, dates: { $push: { p: '$p', at: '$at' } } } });
  pipes.push({ $match: { count: { $gt: 1 } } });
  pipes.push({ $sort: { count: -1 } });
  pipes.push({
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'user'
    }
  });
  pipes.push({ $unwind: '$user' });
  pipes.push({ $project: {
    nickname: '$user.nickname',
    count: 1,
    total: 1,
    stores: 1,
    dates: 1,
  } });
  const datas = await Order.aggregate(pipes).allowDiskUse(true);
  const tp = 1000 * 60 * 60 * 24;
  const items = datas.map((data) => {
    const { dates } = data;
    dates.sort((d1, d2) => {
      return (+d1.at) - (+d2.at);
    });
    let dupcount = 0;
    let dupprice = 0;
    for(let i = 1; i < dates.length; i += 1) {
      const period = ((+dates[i].at) - (+dates[i - 1].at));
      // console.log(period);
      if(period < tp) {
        dupcount += 1;
        dupprice += dates[i].p;
      }
    }
    const item = {
      nickname: data.nickname,
      count: data.count,
      total: data.total,
      scount: data.stores.length,
      dupcount,
      dupprice,
    };
    return item;
  });
  const wb = xls.dups(items);
  wb.write(file, (err, st) => {});
};


(async () => {
  const opt = { status: { $ne: 0 }, at: { $gt: new Date("2019-01-01T00:00:00.000+08:00"), $lt: new Date("2020-01-01T00:00:00.000+08:00") } };
  await position(opt);
  // await tw(opt, '/Users/yj431/dup-19.xls');
  // await tw({ status: { $ne: 0 } }, '/Users/yj431/dup-20.xls');
  mongoose.disconnect();
})();

// ${start}T00:00:00.000+08:00`
// { at: { $gt: ISODate("2019-01-01T00:00:00.000+08:00"), $lt:ISODate("2020-01-01T00:00:00.000+08:00") } }

// 总数 复购用户/复购订单数/订单数 43906/182438/305172
// 19年 复购用户/复购订单数/订单数 30028/120171/212236

// 19年 复购用户/订单数 1843/5791/13288
// 2020 1月 复购用户/订单数 2030/6115/2452
// db.orders.aggregate({$match: { status: { $ne: 0 }, at: { $gt: ISODate("2019-10-01T00:00:00.000+08:00"), $lt:ISODate("2019-11-01T00:00:00.000+08:00") } } }, { $lookup: { from: "stores",localField: "store", foreignField: "_id", as: "store" } }, { $unwind: "$store" }, { $project: { user:1, storeops: "$store.optype" } }, { $match: { storeops: 0 } },{ $group: { _id: "$user", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $group: { _id: null, total: { $sum:1 } } })

// db.orders.aggregate({$match: { status: { $ne: 0 }, at: { $gt: ISODate("2019-10-01T00:00:00.000+08:00"), $lt:ISODate("2019-11-01T00:00:00.000+08:00") } } }, { $lookup: { from: "stores",localField: "store", foreignField: "_id", as: "store" } }, { $unwind: "$store" }, { $project: { user:1, storeops: "$store.optype" } }, { $match: { storeops: 0 } },{ $group: { _id: "$user", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $group: { _id: null, total: { $sum: "$count" } } })

// db.orders.aggregate({$match: { status: { $ne: 0 }, at: { $gt: ISODate("2019-10-01T00:00:00.000+08:00"), $lt:ISODate("2019-11-01T00:00:00.000+08:00") } } }, { $lookup: { from: "stores",localField: "store", foreignField: "_id", as: "store" } }, { $unwind: "$store" }, { $project: { user:1, storeops: "$store.optype" } }, { $match: { storeops: 0 } }, { $group: { _id: null, total: { $sum:1 } } })


// db.orders.aggregate({$match: { status: { $ne: 0 }, at: { $gt: ISODate("2020-01-01T00:00:00.000+08:00"), $lt:ISODate("2020-02-01T00:00:00.000+08:00") } } }, { $lookup: { from: "stores",localField: "store", foreignField: "_id", as: "store" } }, { $unwind: "$store" }, { $project: { user:1, storeops: "$store.optype" } }, { $match: { storeops: 0 } },{ $group: { _id: "$user", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $group: { _id: null, total: { $sum:1 } } })

// db.orders.aggregate({$match: { status: { $ne: 0 }, at: { $gt: ISODate("2020-01-01T00:00:00.000+08:00"), $lt:ISODate("2020-02-01T00:00:00.000+08:00") } } }, { $lookup: { from: "stores",localField: "store", foreignField: "_id", as: "store" } }, { $unwind: "$store" }, { $project: { user:1, storeops: "$store.optype" } }, { $match: { storeops: 0 } },{ $group: { _id: "$user", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $group: { _id: null, total: { $sum: "$count" } } })

// db.orders.aggregate({$match: { status: { $ne: 0 }, at: { $gt: ISODate("2020-01-01T00:00:00.000+08:00"), $lt:ISODate("2020-02-01T00:00:00.000+08:00") } } }, { $lookup: { from: "stores",localField: "store", foreignField: "_id", as: "store" } }, { $unwind: "$store" }, { $project: { user:1, storeops: "$store.optype" } }, { $match: { storeops: 0 } }, { $group: { _id: null, total: { $sum:1 } } })




// db.orders.aggregate({ $match: { status: { $ne: 0 } } }, { $group: { _id: "$user", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $group: { _id: null, ot: { $sum: "$count" }, total: { $sum: 1 } } })

// db.orders.aggregate({ $match: { status: { $ne: 0 }, at: { $gt: ISODate("2019-01-01T00:00:00.000+08:00"), $lt:ISODate("2020-01-01T00:00:00.000+08:00") } } }, { $group: { _id: "$user", count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $group: { _id: null, ot: { $sum: "$count" }, total: { $sum: 1 } } })

// db.orders.aggregate()


// db.orders.aggregate({ $match: { status: { $ne: 0 }, at: { $gt: ISODate("2019-01-01T00:00:00.000+08:00"), $lt:ISODate("2020-01-01T00:00:00.000+08:00") } } }, { $group: { _id: "$position", count: { $sum:1 }, total: { $sum: "$p" } } }, { $sort: { count: -1 } })



// 
// db.orders.aggregate({ $match: { status: { $ne: 0 }, at: { $gt: ISODate("2019-01-01T00:00:00.000+08:00"), $lt:ISODate("2020-01-01T00:00:00.000+08:00") } } },{ $group: { _id: { store:"$store", user: "$user"}, count: { $sum:1 }, total: { $sum: "$p" } } }, { $group: { _id: "$_id.user", dup: { $sum:1 }, count: { $sum: "$count" }, total: { $sum: "$total" } } }, { $match: { dup: { $gt: 1 } } }, { $group: { _id: null, total: { $sum:1 } } })
