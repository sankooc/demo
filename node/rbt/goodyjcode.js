
const db = require('../libs/models');
const _ = require('lodash');
const fs = require('fs');

(async () => {
  const pipe = [{
    $match: { $and: [{ yjCode: { $exists: true } }, { yjCode: { $ne: '' } }] }
  }, {
    $group: {
      _id: '$yjCode',
      name: { $first: '$t' },
      id: { $first: '$_id' },
      cost_price: { $first: '$cost' },
      original_price: { $first: '$op' },
      sell_price: { $first: '$p' },
      first_category: { $first: '$yjCategoryIndexCode' },
      secondary_category: { $first: '$yjCategoryCode' },
    },
  }];

  pipe.push({ $lookup: {
    from: 'goodexts',
    localField: 'id',
    foreignField: 'good',
    as: 'ext'
  }});
  const items = await db.Good.aggregate(pipe);

  const strs = [];
  for(const item of items) {
    const code = item._id;
    const { name, id, cost_price, original_price, sell_price, first_category, secondary_category } = item;
    const image_url = _.get(item, 'ext[0].cover.f');
    const str = `('${id.toString()}', '${name}', ${cost_price}, ${original_price}, ${sell_price}, '${code}', '${image_url}')`;
    strs.push(str);
  }
  let sql = `INSERT INTO goods_basic ( id, name, cost_price, original_price, sell_price, code, image_url) VALUES ${strs.join(',')}`;
  console.log(sql);
})();
