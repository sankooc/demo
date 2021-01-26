import bluebird from 'bluebird';
import mongoose from 'mongoose';
import { Order, Record, User, Task, Transaction } from '../libs/models';
// import { mainStory as storyboard } from 'storyboard';

import { host, isDevelopment, logger } from '../libs/utils';

// const autoIncrement = require('mongoose-auto-increment');

// const mongooseOptions = { poolSize: isDevelopment ? 2 : 10, autoReconnect: true, useNewUrlParser: true, promiseLibrary: bluebird };

// mongoose.Promise = bluebird;

// mongoose.set('debug', isDevelopment);
// mongoose.connect(`mongodb://${host}:27017/andrew`, mongooseOptions).then(
//   () => { logger('Mongo Ready Now', 'App'); },
//   (err) => { logger(`Mongo Error: ${err}`, 'App'); }
// );
(async function() {
  // '$gte': 2019-06-24T16:00:00.000Z, '$lte': 2019-07-02T15:59:59.999Z }
  //   const orderCount = await Order.countDocuments({});
  //   logger(`ordercount ${orderCount}`);

  const today = { $gte: new Date('2019-06-24T16:00:00.000Z'), $lte: new Date('2019-07-02T15:59:59.999Z') };
  const store = false;
  const userCountQuery = { type: 2 };
  const userDailyCountQUery = { type: 2, at: today };
  console.time('userCount');
  const userCount = await Record.find(userCountQuery).distinct('user');
  console.timeEnd('userCount');
  
  console.time('userDailyCount');
  const userDailyCount = await Record.find(userDailyCountQUery).distinct('user');
  console.timeEnd('userDailyCount');
  console.time('allUserList');
  const allUserList = await User.countDocuments({ _id: { $in: userCount } });
  console.timeEnd('allUserList');
  console.time('dailyUserList');
  const dailyUserList = await User.countDocuments({ _id: { $in: userDailyCount }, at: today });
  console.timeEnd('dailyUserList');
  console.time('checkinCount');
  const checkinCount = await Record.countDocuments(userCountQuery);
  console.timeEnd('checkinCount');
  console.time('checkinDailyCount');
  const checkinDailyCount = await Record.countDocuments(userDailyCountQUery);
  console.timeEnd('checkinDailyCount');
  console.time('orderCount');

  const orderCount = await Order.countDocuments(store ? { store } : {});
  console.timeEnd('orderCount');
  console.time('orderDailyCount');
  const orderDailyCount = await Order.countDocuments(store ? { store, at: today } : { at: today });
  console.timeEnd('orderDailyCount');
  console.time('activeOrderDailyCount');
  const activeOrderDailyCount = await Order.countDocuments(store ? { store, at: today, status: { $in: [1, 2, 3, 4, 5] } } : { at: today, status: { $in: [1, 2, 3, 4, 5] } });
  console.timeEnd('activeOrderDailyCount');

  console.time('taskPasswordCount');
  const taskPasswordCount = await Task.countDocuments(store ? { store, type: Task.TYPES.PASSWORD.ordinal } : { type: Task.TYPES.PASSWORD.ordinal });
  console.timeEnd('taskPasswordCount');
  console.time('taskPasswordDailyCount');
  const taskPasswordDailyCount = await Task.countDocuments(store ? { store, type: Task.TYPES.PASSWORD.ordinal, at: today } : { type: Task.TYPES.PASSWORD.ordinal, at: today });
  console.timeEnd('taskPasswordDailyCount');

  console.time('taskNoPasswordCount');
  const taskNoPasswordCount = await Task.countDocuments(store ? { store, type: Task.TYPES.NO_PASSWORD.ordinal } : { type: Task.TYPES.NO_PASSWORD.ordinal });
  console.timeEnd('taskNoPasswordCount');
  console.time('taskNoPasswordDailyCount');
  const taskNoPasswordDailyCount = await Task.countDocuments(store ? { store, type: Task.TYPES.NO_PASSWORD.ordinal, at: today } : { type: Task.TYPES.NO_PASSWORD.ordinal, at: today });

  console.timeEnd('taskNoPasswordDailyCount');
  console.time('taskContainerCount');
  const taskContainerCount = await Task.countDocuments(store ? { store, type: Task.TYPES.CONTAINER.ordinal } : { type: Task.TYPES.CONTAINER.ordinal });
  
  console.timeEnd('taskContainerCount');
  console.time('taskContainerDailyCount');
  const taskContainerDailyCount = await Task.countDocuments(store ? { store, type: Task.TYPES.CONTAINER.ordinal, at: today } : { type: Task.TYPES.CONTAINER.ordinal, at: today });
  console.timeEnd('taskContainerDailyCount');
  const orderFilter = { status: { $nin: [0, 7] }, at: today };
  const orderFilterAll = { status: { $nin: [0, 7] } };
  console.time('allOrders');
  const allOrders = await Order.find(orderFilterAll, 'p')
  console.timeEnd('allOrders');
  console.log(allOrders.length)
  const orderTracer = (orders) => {
      const list = [];
      const total = orders.reduce((lst, item) => {
          list.push(item._id);
          return lst + (item.p || 0);
      }, 0);
      return { total, list };
  };
  const rs1 = orderTracer(allOrders);
  const allOrderPriceTotal = rs1.total;
  const allids = rs1.list;
//   for(const item of allOrders) {
//     allids.push(item._id);
//     allOrderPriceTotal += item.p;
//   }

//   let orderPriceTotal = 0;
  const orders = await Order.find(orderFilter);
  const rs2 = orderTracer(orders);
  const orderPriceTotal = rs2.total;
  const ids = rs2.list;
//   const ids = [];
//   for(const item of orders) {
//     ids.push(item._id);
//     orderPriceTotal += item.p;
//   }
  console.log(orders.length);

  const revenue = await Transaction.aggregate([
    { $match: { order: { $in: allids }, 'data.result_code' : 'SUCCESS' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const dailyRevenue = await Transaction.aggregate([
    { $match: { order: { $in: ids }, 'data.result_code' : 'SUCCESS' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const rs = {
    userCount: allUserList,
    userDailyCount: dailyUserList,
    checkinCount,
    checkinDailyCount,
    orderCount,
    orderDailyCount,
    activeOrderDailyCount,
    taskPasswordCount,
    taskPasswordDailyCount,
    taskNoPasswordCount,
    taskNoPasswordDailyCount,
    taskContainerCount,
    taskContainerDailyCount,
    orderPriceTotal : parseFloat((orderPriceTotal / 100).toFixed(2)),
    allOrderPriceTotal : parseFloat((allOrderPriceTotal / 100).toFixed(2)),
  };
  console.dir(rs);
  mongoose.disconnect();
})();


/**
 * 

 { userCount: 88096,
  userDailyCount: 0,
  checkinCount: 175025,
  checkinDailyCount: 0,
  orderCount: 71373,
  orderDailyCount: 0,
  activeOrderDailyCount: 0,
  taskPasswordCount: 17686,
  taskPasswordDailyCount: 0,
  taskNoPasswordCount: 433,
  taskNoPasswordDailyCount: 0,
  taskContainerCount: 37505,
  taskContainerDailyCount: 0 }

  
userCount: 982.821ms
userDailyCount: 3.683ms
allUserList: 443.808ms
dailyUserList: 1.633ms
checkinCount: 68.858ms
checkinDailyCount: 1.179ms
orderCount: 27.798ms
orderDailyCount: 1.206ms
activeOrderDailyCount: 1.438ms
taskPasswordCount: 28.529ms
taskPasswordDailyCount: 38.196ms
taskNoPasswordCount: 24.679ms
taskNoPasswordDailyCount: 28.114ms
taskContainerCount: 30.103ms
taskContainerDailyCount: 47.005ms
allOrders: 3364.199ms
  
  
 * 
 * 
 */