/* eslint-disable prefer-object-spread */
/* eslint-disable no-await-in-loop */

// await Store.findOneAndUpdate({ _id: s._id }, { $unset: { servicePlaceId: 1 } });

// const _ = require('lodash');
// const crypto = require('crypto');
// const request = require('request-promise');
const mongoose = require('mongoose');
const moment = require('moment');
const models = require('../libs/models');
require('../prepare');

// const Store = require('../libs/models/Store');
// const CronTimer = require('../libs/models/CronTimer');
// const RobotTask = require('../libs/models/RobotTask');

// (async () => {
//   const stores = await Store.find({ $and: [{ cloneObj: { $exists: true } }, { servicePlaceId: { $ne: '' } }, { servicePlaceId: { $exists: 1 } }] });
//   let ct = 0;
//   for(const s of stores) {
//     const { servicePlaceId } = s;
//     const cc = await Store.countDocuments({ servicePlaceId });
//     if(cc > 1) {
//       const _id = s._id;
//       console.log(_id.toString() + ',' + servicePlaceId + ',' + cc + ',', s.t);
//       ct += 1;
//     }
//   }
//   mongoose.disconnect();
// })();

const _ = require('lodash');
const fs = require('fs');
const orderStatService = require('../libs/services/orderStatisticsService');

const xls = require('../service/xls');

(async () => {
  const file = '/Users/yj431/demo.xlsx';
  if(fs.existsSync(file)) fs.unlinkSync(file);
  // const rs = await orderStatService.storeMonthStat('5ceb7aecd8b1b4598881372a', '2019-09');
  // // const rs = await orderStatService.storeMonthStat('5d56ba511fc6225f9748df96', '2019-11');
  // xls.storeMonthStat(rs, '2019-09', file);

  // const province = '浙江省';
  // const start = new Date('2019-10-01 00:00:00');
  // const end = new Date('2019-10-01 00:00:00');
  // const rs = await orderStatService.goodStat(province, start, end);
  const clearTrack = { $set: {} };
  const rs = await models.Track.updateMany({ good: '5c15c2182eac9f7e4da3512b' }, clearTrack, { new: true, multi: true });
  console.log(rs);
  mongoose.disconnect();
})();

// const { StoreOps } = require('../libs/models');


// (async () => {
//   const date = '2019-09';
//   const start = moment(date).startOf('month').toDate();
//   const end = moment(date).endOf('month').toDate();
//   const d = Date.now();
//   const offset = Math.floor((end.getTime() - d) / (1000 * 60 * 60 * 24));
//   const result = await orderStatService.stat({ start, end, optype: 1, city: '成都市' });
//   const sids = result.items.map(r => r._id);
//   const sos = await StoreOps.find({ store: { $in: sids } }, 'monthObjective store');
//   const opMap = {};
//   for(const so of sos) {
//     opMap[so.store.toString()] = so.monthObjective;
//   }
//   const items = [];
//   for(const it of result.items) {
//     const item = Object.assign({}, it);
//     item.uconvert = 0;
//     if(item.users) {
//       item.uconvert = item.effective / item.users
//     }
//     item.objective = opMap[it.id] || '-';
//     if(item.objective !== '-') {
//       item.lilun = item.objective - item.oprice;
//       item.shiji = item.objective - item.real;
//     } else {
//       item.lilun = 0;
//       item.shiji = 0;
//     }
//     if(item.objective !== '-' && offset > 0) {
//       item.dlilun = item.lilun / offset;
//       item.dshiji = item.shiji / offset;
//     } else {
//       item.dlilun = '-';
//       item.dshiji = '-';
//     }
//     items.push(item);
//   }
//   // console.log(result);
//   mongoose.disconnect();
// })();



// require('../libs/models');

// const Test = require('../libs/models/Test');


// (async () => {
//   const test = new Test();
//   test.filePath = 'ddd';
//   await test.save();
//   console.log('save_complete');
// })();

// const hashes = require('bling-hashes');

// const { ObjectId } = require('mongodb');

// const bkdr = (obj, seed = 131) => {
//   if(!obj) return 0;
//   const str = obj.toString();
//   let hash = 0;
//   for (let i = 0; i < str.length; i += 1) {
//     const ch = str.charCodeAt(i);
//     // eslint-disable-next-line no-bitwise
//     hash = (hash * seed + ch) & 0x7fffffff;
//   }
//   return hash;
// };
// // const data = 'dsadsadsadsad';


// console.log(bkdr(ObjectId('5dd26d517476960bb29b7839')));
// console.log(bkdr(ObjectId('5dd26d6c33f0ad0bb3507942')));
