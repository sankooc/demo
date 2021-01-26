/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
// const request = require('request-promise');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const os = require('../libs/services/orderStatisticsService');
const db = require('../libs/models');

const rl = async (date) => {
  const rs = await os.orderInfoFromDay(null, date);
  for(const k in rs) {
    const d = rs[k];
    d.date = date;
    d.dateAt = moment(date).startOf('day').toDate();
    d.store = k;
    d.storeId = ObjectId(k);
    await db.StoreStatCache.findOneAndUpdate({ date, store: k }, { $set: d }, { upsert: 1 });
  }
};

(async () => {
  const date = '2020-01-02';
  let count = 0;
  while(true) {
    const d = moment(date).add(count, 'day').format('YYYY-MM-DD');
    await rl(d);
    count += 1;
    if(count > 20) {
      break;
    }
  }
  // const rs = await os.orderInfoFromDay(null, date);
  // for(const k in rs) {
  //   const d = rs[k];
  //   d.date = date;
  //   d.dateAt = moment(date).startOf('day').toDate();
  //   d.store = k;
  //   d.storeId = ObjectId(k);
  //   await db.StoreStatCache.findOneAndUpdate({ date, store: k }, { $set: d }, { upsert: 1 });
  // }
  // const rs = {
  //   current: {
  //     cOrderCount: 0,
  //     cOrderPrice: 0,
  //     real: 0,
  //     effective: 0,
  //     scans: 0,
  //     users: 0,
  //     tasks: 0,
  //     convert: 0,
  //     kedan: 0
  //   },
  //   last: {
  //     cOrderCount: 0,
  //     cOrderPrice: 0,
  //     real: 0,
  //     effective: 0,
  //     scans: 0,
  //     users: 0,
  //     tasks: 0,
  //     convert: 0,
  //     kedan: 0
  //   },
  //   items: [],
  //   city: '上海城区',
  //   t: '云迹',
  //   countRate: null,
  //   priceRate: null,
  //   dPrice: 0,
  //   rank: 100,
  //   date,
  // };
  // const m = moment(date);
  // for(let i = 0; i < 7; i += 1) {
  //   const d = m.format('YYYY-MM-DD');
  //   m.subtract(1, 'day');
  //   rs.items.unshift({ date: d, price: 0 });
  // }

  // console.dir(rs);
  // const option = {
  //   method:"POST",
  //   json: true,
  //   url:"http://aicy.iflytek.com/ai/yunjiproxy/open/api/notifyOrder",
  //   body:{"storeId":"5e53469cb445e658ceb6bc4d","orderSN":"11295319451503","taskId":"5e81b2016ce7962f7a2715d1","createTime":1585558104508},
  // };
  // const resp = await request(option);
  // console.dir(resp);
})();
