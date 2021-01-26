/* eslint-disable no-await-in-loop */

const { ObjectId } = require('mongodb');
const { Store, Good } = require('../libs/models');


(async () => {
  const stores = await Store.find({ tags: ObjectId('5e3d3884c7e6f801455a921a'), optype: 0 }, '_id t');
  const count = 0;
  for(const s of stores) {
    console.log(s._id.toString(), s.t);
    const gds = await Good.find({ store: s._id, isIsolated: true });
    console.log(gds.length);
    for (const gd of gds) {
      gd.isIsolated = false;
      try {
        await gd.save();
        count += 1;
      }catch(e){}
    }
  }

  console.log(count);
})();
