const moment = require('moment');
const _ = require('lodash');
const { ObjectId } = require('mongodb');

const model = require('../models');

const appendpipe = (pipes, model, localField, unwind) => {
  const $lookup = {
    from: model,
    localField,
    foreignField: '_id',
    as: localField
  };
  pipes.push({ $lookup });
  if(unwind) {
    const $unwind = {
      path: `$${localField}`,
      preserveNullAndEmptyArrays: true,
    };
    pipes.push({ $unwind });
  }
};
exports.create = () => {
  const fetch = async () => {
    const start = moment().subtract(1, 'month').startOf('month').toDate();
    const end = moment().subtract(1, 'month').endOf('month').toDate();
    const $match = { order: ObjectId('5b43489ef6b8bb38ad686e39'), 'data.result_code': 'SUCCESS' };
    const $group = { _id: '$order' };
    const pipeline = [{ $match }];
    appendpipe(pipeline, 'orders', 'order', true);
    pipeline.push({ $project: { type: 1, channel: 1, amount: 1, item: '$order.items' } });
    appendpipe(pipeline, 'orderitems', 'item');
    pipeline.push({ $unwind: '$item' });
    const list = await model.Transaction.aggregate(pipeline);
    // pipeline.push({ $group: { _id: '$items.' } });
    console.log(list);
  };
  return { fetch };
};
