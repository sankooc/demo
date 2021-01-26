
const _ = require('lodash');
const mongoose = require('mongoose');

require('../prepare');

const db = require('../libs/models');

const createCM = async (s) => {
  const { _id, cloneObj, at } = s;
  console.log('start', _id);
  const doc = { to: _id, from: cloneObj, status: 'init', goodCount: 0, containerCount: 0, categoryCount: 0, trackCount: 0 };
  doc.goodCount = await db.Good.countDocuments({ store: _id, cloneObj: { $exists: 1 } });
  doc.containerCount = await db.Container.countDocuments({ store: _id, cloneObj: { $exists: 1 } });
  doc.categoryCount = await db.Category.countDocuments({ store: _id, cloneObj: { $exists: 1 } });
  const ct = (await db.Container.find({ store: _id }, '_id')) || [];
  doc.trackCount = await db.Track.countDocuments({ container: { $in: ct }, cloneObj: { $exists: 1 } });
  doc.at = at;
  await db.CloneMap.findOneAndUpdate({ to: _id }, { $set: doc }, { upsert: 1 });
};

const rolls = async () => {
  const st = (await db.CloneMap.find({}, 'to')).map(d => d.to);
  const filter = { cloneObj: { $exists: 1 }, _id: { $nin: st } };
  const stores = await db.Store.find(filter, 'cloneObj at');
  for(const s of stores) {
    await createCM(s);
  }
};

(async () => {
  await rolls();
  mongoose.disconnect();
})();
