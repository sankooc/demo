/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');

const orderService = require('../libs/services/orderStatisticsService');
const storeService = require('../service/store');
const model = require('../libs/models');

const start = async () => {
  // const start = new Date('2019-09-01 10:30:00');
  // const end = new Date('2019-09-06 11:00:00');
  // const limit = 20;
  // const skip = 0;
  // await orderService.stat({ start, end, limit, skip, name: '成都' }, true);
  // const rs = await orderService.stat2('5ac9806cd40d3372c999d2f9', new Date('2019-06-08T16:00:00.000Z'), new Date('2019-07-09T15:59:59.000Z'));
  // console.log(rs);
  // const ors = await orderService.scenicspotClass({ city: 28, page: 1, limit: 10 });
  // console.log(ors);

  
  // const start = new Date('2019-08-01 00:00:00');
  // const end = new Date('2019-08-01 11:00:00');
  // await orderService.orderStac(start, end);
  // const { Good } = model;

  // const toMap = (enums) => {
  //   const map = {};
  //   const vals = enums.enumValues;
  //   for(const v of vals) {
  //     map[v.ordinal] = v.label;
  //   }
  //   return k => map[k] || k;
  // };
  // const smap = toMap(Good.STATUS);
  // const dmap = toMap(Good.DELIVERY_TYPES);
  // const amap = toMap(Good.ALLOCATION_TYPES);
  // const swap = (item) => {
  //   const it = _.pick(item, 'allocation', 'allocationType', 'status');
  //   item.ext = item.ext || { tracks: [], stock: 0 };
  //   it.deliveryType = _.get(item, 'ext.deliveryType');
  //   it.id = (item._id || item.id).toString();
  //   it.name = item.t || '';
  //   it.displayName = item.displayName || '';
  //   it.category = _.get(item, 'category.t');
  //   it._allocationType = amap(item.allocationType);
  //   it._deliveryType = dmap(_.get(item, 'ext.deliveryType'));
  //   it.storename = _.get(item, 'store.t');
  //   const cur = (field) => {
  //     const price = item[field] || 0;
  //     return (price / 100).toFixed(2);
  //   };
  //   it.p = cur('p');
  //   it.op = cur('op');
  //   it.cost = cur('cost');
  //   it.stock = _.get(item, 'ext.stock') || 0;
  //   it._status = smap(item.status);
  //   it.joind = item.isJoinBoon ? '参加' : '不参加';
  //   it.at = moment(item.at).format('YYYY-MM-DD HH:mm:ss');
  //   it.uat = moment(item.uat).format('YYYY-MM-DD HH:mm:ss');
  //   if(item.store) {
  //     it.store = (item.store.id || item.store._id).toString();
  //   }
  //   const { allocationType } = item;
  //   if(allocationType === undefined || allocationType === 100) {
  //     it._error = true;
  //   } else {
  //     it._error = false;
  //     if(item.store.allocations) {
  //       switch(allocationType) {
  //         case 0:
  //           it.rate = item.store.allocations.self;
  //           it.rate2 = item.store.allocations.agent_self;
  //           break;
  //         case 1:
  //           it.rate = item.store.allocations.platform;
  //           it.rate2 = item.store.allocations.agent_platform;
  //           break;
  //         case 2:
  //           it.rate = item.store.allocations.other;
  //           it.rate2 = item.store.allocations.agent_other;
  //           break;
  //         default:
  //       }
  //     }
  //   }
  //   it.dec = `${Math.round((1 - it.rate - it.rate2) * 100)} / ${Math.round(it.rate * 100)} / ${Math.round(it.rate2 * 100)}`;
  //   return it;
  // };
  // const ft = await storeService.goods({ sid: '5ce001a9dae382140aa6dc4a', deliveryType: 0, skip: 0, limit: 2 });
  // console.log(ft.items);
  // const its = ft.items.map(swap);
  // console.log(its);
  // _.keyBy(model.Good.STATUS.enumValues, () => {});
  await orderService.dailyStat({}, '2019-09-12');
  mongoose.disconnect();
};

(start)();
