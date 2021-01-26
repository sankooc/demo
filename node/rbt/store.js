/* eslint-disable no-await-in-loop */
// const { ObjectId } = require('mongodb');
// import mongoose from 'mongoose';
// import { Order, Container, Category, Good, GoodExt, Track } from '../libs/models';
// import Store from '../libs/models/Store';
// import { O_TRUNC } from 'constants';
// import { get } from 'https';
// import { timingSafeEqual } from 'crypto';
const _ = require('lodash');
const mongoose = require('mongoose');

require('../prepare');

const storeService = require('../service/store');

const models = require('../libs/models');

const clear = async (id) => {
  // const cp = await models.CloneMap.findOne({ from: id });
  // if(cp) {
  //   await storeService.rollbackClone(cp.id || cp._id);
  //   console.log('clear');
  // }
  await models.Store.deleteMany({ cloneObj: { $exists: true } });
  await models.Container.deleteMany({ cloneObj: { $exists: true } });
  await models.Category.deleteMany({ cloneObj: { $exists: true } });
  await models.Good.deleteMany({ cloneObj: { $exists: true } });
  await models.GoodExt.deleteMany({ cloneObj: { $exists: true } });
  await models.Track.deleteMany({ cloneObj: { $exists: true } });
  await models.CloneMap.remove({});
};

// const cloneContainer = async (context, items) => {
//   const { from, to } = context.store;
//   const cs = (await Container.find({ store: from })) || [];
//   for(let i = 0; i < items.length; i += 1) {
//     const { t, pid } = items[i];
//     const origin = cs[i];
//     if(origin) {
//       const cit = origin.toJSON();
//       const raw = _.omit(cit, 'id', '_id', 'at', 'uat', 'store');
//       raw.t = t;
//       raw.pid = pid;
//       raw.store = to;
//       raw.cloneObj = cit.id;
//       const newObj = await Container.create(raw);
//       context.container[origin._id.toString()] = newObj._id.toString();
//     }
//   }
// };

// const cloneCategory = async (context) => {
//   const { from, to } = context.store;
//   context.category = {};
//   const cs = (await Category.find({ store: from }, null, { sort: { _id: 1 } })) || [];
//   const list = [];
//   const findOne = (id) => {
//     const p = id.toString();
//     for(const raw of list) {
//       if(raw.id.toString() === p) return raw;
//     }
//   };
//   const parentExists = (parent) => {
//     if(!parent) {
//       return true;
//     }
//     return undefined !== findOne(parent);
//   };
//   while (cs.length) {
//     let conti = false;
//     for(let i = 0; i < cs.length;) {
//       const raw = cs[i];
//       const it = raw.toJSON();
//       const { parent } = it;
//       if(!parentExists(parent)) {
//         i += 1;
//       } else {
//         list.push(it);
//         conti = true;
//         cs.splice(i, 1);
//       }
//     }
//     if(cs.length === 0) {
//       break;
//     }
//     if(!conti && cs.length) {
//       throw new Error('dep error');
//     }
//   }
//   for(const it of list) {
//     const raw = _.omit(it, 'id', '_id', 'store', 'at', 'uat', 'parent');
//     raw.store = to;
//     raw.cloneObj = it.id;
//     if(it.parent) {
//       const k = it.parent.toString();
//       const c = context.category[k];
//       if(c) {
//         raw.parent = ObjectId(c);
//       }
//     }
//     const rr = await Category.create(raw);
//     context.category[it.id.toString()] = rr._id.toString();
//   }
// };

// const cloneTrack = async (context, goodId, tracks) => {
//   const data = tracks.map((t) => {
//     const raw = _.omit(t, 'id', '_id', 'at', 'uat', 'container', 'good');
//     raw.good = goodId;
//     raw.cloneObj = t._id;
//     const ct = context.container[t.container];
//     if(ct) {
//       raw.container = ObjectId(ct);
//     } else {
//       console.log('no this category:', t.container);
//     }
//     return raw;
//   });
//   return Track.insertMany(data);
// };

// const cloneGoodExt = async (context, goodId, ext) => {
//   if(!ext) {
//     return;
//   }
//   if(!ext._id) {
//     return;
//   }
//   const { tracks, _tracks } = ext;
//   const it = _.omit(ext, 'id', '_id', 'at', 'uat', 'good', 'tracks', '_tracks');
//   it.good = goodId;
//   it.tracks = [];
//   it.cloneObj = ext._id;
//   const ge = await GoodExt.create(it);

//   const exid = ext._id.toString();
//   context.goodext[exid] = ge._id.toString();
//   if(tracks.length) {
//     const tss = await cloneTrack(context, goodId, _tracks);
//     if(tss && tss.length) {
//       const ts = tss.map(t => t._id);
//       await GoodExt.findByIdAndUpdate(ge._id, { $set: { tracks: ts } });
//     }
//   }
//   return ge._id;
// };

// const cloneGood = async (context) => {
//   context.good = {};
//   context.goodext = {};
//   context.track = {};
//   const store = context.store.from;
//   const ns = context.store.to;
//   const pipes = [];
//   pipes.push({ $match: { store } });
//   {
//     const $lookup = {
//       from: 'goodexts',
//       localField: 'ext',
//       foreignField: '_id',
//       as: 'ex'
//     };
//     pipes.push({ $lookup });
//     const $unwind = {
//       path: '$ex',
//       preserveNullAndEmptyArrays: true,
//     };
//     pipes.push({ $unwind });
//   }
//   {
//     const $lookup = {
//       from: 'tracks',
//       localField: 'ex.tracks',
//       foreignField: '_id',
//       as: 'ex._tracks'
//     };
//     pipes.push({ $lookup });
//   }
//   const items = await Good.aggregate(pipes);

//   for(const it of items) {
//     const goodExt = it.ex;
//     const raw = _.omit(it, 'id', '_id', 'at', 'uat', 'store', 'ext', 'ex', 'category', 'goods');
//     raw.goods = [];
//     raw.store = ns;
//     raw.cloneObj = it._id;
//     raw.ext = ObjectId('000000000000000000000000');
//     raw.displayName = raw.displayName || raw.t || '默认';
//     if(it.category) {
//       raw.category = context.category[it.category.toString()];
//     }
//     const g = await Good.create(raw);
//     const goodId = g._id;
//     context.good[it._id.toString()] = goodId.toString();
//     const geId = await cloneGoodExt(context, goodId, goodExt);
//     if(geId) {
//       await Good.findByIdAndUpdate(goodId, { $set: { ext: geId } });
//     }
//   }
// };

// const cloneStore = async (id, rs) => {
//   if(!ObjectId.isValid(id)) {
//     throw new Error('envalid store id');
//   }
//   const sid = rs.store;
//   const ts = rs.cs.map(c => c.t);
//   const ps = rs.cs.map(c => c.pid);
//   {
//     const count = Store.countDocuments({ t: sid });
//     if(count > 0) throw new Error('dump store');
//   }
//   {
//     const count = await Container.countDocuments({ $or: [
//       { t: { $in: ts } },
//       { pid: { $in: ps } }
//     ] });
//     if(count > 0) throw new Error('dump container');
//   }

//   const context = {
//     store: {},
//     container: {},
//   };
//   const s = await Store.findById(id);
//   if(!s) {
//     throw new Error('no this store');
//   }
//   context.store.from = s._id;
//   const store = s.toJSON();
//   // console.dir(store);
//   if(!store.cover.f) {
//     store.cover.f = store.cover.url;
//   }
//   const raw = _.omit(store, 'id', '_id', 'cloneObj', 'at', 'uat');
//   raw.t = rs.store;
//   Object.assign(raw, { cloneObj: ObjectId(id) });
//   const rr = await Store.create(raw);
//   context.store.to = rr._id;
//   console.time('clone container');
//   await cloneContainer(context, rs.cs);
//   console.timeEnd('clone container');
//   console.time('clone category');
//   await cloneCategory(context);
//   console.timeEnd('clone category');
//   console.time('clone good and tracks');
//   await cloneGood(context);
//   console.timeEnd('clone good and tracks');
// };


(async () => {
  // const id = '5d087be413f22c6a8c6fb44a';
  // const id = '5ceb7aecd8b1b4598881372a';
  // const data = {
  //   store: 'cloneTest',
  //   cs: [{ t: '11113333333', pid: '3333333' }],
  // };
  // await clear(id);
  // const rs = await storeService.clone(id, data);
  // mongoose.disconnect();
  CheckoutRequest = {
    file: {
      excel: 'http://',
      md5: '12',
    },
    store: '',
    start: '',
    end: '',
    at: Date
    status: 0,
  }
  ModiRequest = {
    cid: '',
    items: [
      { id: '' }
    ]
    status: ''
  }
})();

// (async () => {
//   const id = '5e007065c9fa7c4022f85660';

// })();


// { from: "goodexts", localField: "ext", foreignField: "_id", as: "exts" }
// { $match: { valid: true } }, { $project: { ext: 1 } } , { $lookup: { from: "goodexts", localField: "ext", foreignField: "_id", as: "exts" } }, { $project: { size: { $size: "$exts" } } }, { $match: { size: { $ne: 1 } } }