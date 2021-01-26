/* eslint-disable no-await-in-loop */
const Good = require('../libs/models/Good');
const mongoose = require('mongoose');

(async () => {
  while(true) {
    const items = await Good.find({ classify: { $exists: false } }, 't classify').limit(30);
    if(!items.length) break;
    const promise = items.map((item) => {
      const { _id, t } = item;
      return Good.findOneAndUpdate({ _id }, { $set: { classify: t } }, { upsert: false });
    });
    await Promise.all(promise);
  }
  console.log('complete');
  mongoose.disconnect();
})();
