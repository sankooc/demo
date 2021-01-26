const _ = require('lodash');
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'andrew';
// Connect using MongoClient
const updateOne = async function(Mdel, item) {
  if(item.at) {
    const at = moment(item.at).add(60, 'days').toDate();
    await Mdel.findOneAndUpdate({ _id: item._id }, { $set: { version: '1.00', at } });
  }
};
const mta = 50;
const bathc = async function(Mdel) {
    const items = await Mdel.find({ version: { $ne: '1.00' } }, { limit: mta }).toArray();
    const ps = items.map((item) => {
       return updateOne(Mdel, item);
    });
    await Promise.all(ps);
    return items.length;
};
const doit = async function(client, db) {
  const Mdel = db.collection('orders');
  let flag = true;
  console.log('start');
  while(flag) {
      const rs = await bathc(Mdel);
      if (rs < mta){
          break;
      }
  }
  console.log('finish');
//   const item = await Mdel.findOne({ _id: ObjectID('5cce740662e1705548de9e20') });
//   if(item.at) {
//     const at = moment(item.at).add(60, 'days').toDate();
//     Mdel.findOneAndUpdate({ _id: item._id }, { $set: { version: '1.00', at } });
//   }
    // const items = await Mdel.find({ version: { $ne: '1.00' } }).toArray();
    // for(){}
  client.close();
}
MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  doit(client, db);
  //   const db = client.db(dbName);
  //   const User = db.collection('users');
  //   col.find({})
  // Show that duplicate records got dropped
  //   col.find({}).toArray(function(err, items) {
  //     test.equal(null, err);
  //     test.equal(4, items.length);
  //     client.close();
  //   });
});


/// 5a5e2ee37467371855120bd3

// 2018-01-16T16:57:07.322Z


// db.users.update({_id: ObjectId("5a5e2ee37467371855120bd3")}, { $inc: { at: 200000} })
