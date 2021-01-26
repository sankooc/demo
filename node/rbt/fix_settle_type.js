const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs');

require('../prepare');
const db = require('../libs/models');

const map = {
  0: 'yunjigoods',
  1: 'hotelgoods',
  2: 'othergoods',
};
(async () => {
  const stores = await db.Store.find();
  for(const s of stores) {
    const goods = await db.Good.find({ settleType: { $exists: false } , store: s, allocationType: { $in: [0, 1, 2] } });
    for(const good of goods) {
      const { id, allocationType } = good;
      const settleType = map[allocationType];
      good.settleType = settleType;
      // await good.save();
      console.log(id);
      await db.Good.findOneAndUpdate({ _id: id }, { $set: { settleType } });
    }
  }
  mongoose.disconnect();
})();
