import redis from '../libs/redis';
import mongoose from 'mongoose';
const fs = require('fs');
const cservide = require('../libs/services/ctrip');

(async function() {
  // const token = await cservide.getCtripToken();
  // console.log(token);
  // const list = await cservide.getScenicspotListACms({ keyword: '' });
  // const list = await cservide.getAllCityCode();
  // console.dir(list);
  // const { data } = list;
  // fs.writeFileSync(__dirname + '/../cities.json', JSON.stringify(data));

  // const list = await cservide.getResourceList({ filters: { scenicspotId: 1986489 } });
  // console.dir(list)
  const rs = await cservide.getScenicspotDetail({ id: 1986489 });
  console.dir(rs)
  redis.quit();
  mongoose.disconnect();
})();


