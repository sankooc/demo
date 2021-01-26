
/** 
db.sub.insert({name : 'name1'})
db.sub.insert({_id: ObjectId("5d1cc458d63558ea188d828f"), name : 'name2'})
db.sub.insert({_id: ObjectId("5d1cc459d63558ea188d8290"), name : 'name3'})


db.other.insert({ status: 'init', dis: 'd1', sid: ObjectId("5d1cc458d63558ea188d828e")});
db.other.insert({ status: 'done', dis: 'd2', sid: ObjectId("5d1cc458d63558ea188d828e")});
db.other.insert({ status: 'pending', dis: 'd3', sid: ObjectId("5d1cc458d63558ea188d828e")});
db.other.insert({ status: 'init', dis: 'd4', sid: ObjectId("5d1cc458d63558ea188d828e")});
db.other.insert({ status: 'done', dis: 'd5', sid: ObjectId("5d1cc458d63558ea188d828e")});
db.other.insert({ status: 'init',dis: 'd6', sid: ObjectId("5d1cc458d63558ea188d828e")});
db.other.insert({ status: 'init', dis: 'd7', sid: ObjectId("5d1cc458d63558ea188d828f")});
db.other.insert({ status: 'done',dis: 'd8', sid: ObjectId("5d1cc458d63558ea188d828f")});
db.other.insert({ status: 'pending',dis: 'd9', sid: ObjectId("5d1cc458d63558ea188d828f")});
db.other.insert({ status: 'init',dis: 'd10', sid: ObjectId("5d1cc458d63558ea188d828f")});
db.other.insert({ status: 'error',dis: 'd11', sid: ObjectId("5d1cc458d63558ea188d828f")});
**/


db.sub.aggregate({$match: {_id: ObjectId("5d1cc458d63558ea188d828e")}}, { $lookup: { from: "other", as: "other", let: { ss: "$_id" }, pipeline: [{ $match: { $expr: { $and:[{ $eq: ["$sid", "$$ss"] }] } } }] } })

const k = { let: { ss: "$_id" }, pipeline: [{ $match: { $expr: { $and:[{ $eq: ["$sid", "$$ss"] }] } } }]  }
// const condi = {
//   $lookup: 
// }

{
  getCmdLineOpts: 1,
  lsid: {
    id: Binary { sub_type: 4, buffer: [Buffer [Uint8Array]], position: 16 }
  },
  '$db': 'admin'
}
{
  argv: [
    '/usr/local/opt/mongodb-community/bin/mongod',
    '--config',
    '/usr/local/etc/mongod.conf'
  ],
  parsed: {
    config: '/usr/local/etc/mongod.conf',
    net: { bindIp: '127.0.0.1' },
    storage: { dbPath: '/usr/local/var/mongodb' },
    systemLog: {
      destination: 'file',
      logAppend: true,
      path: '/usr/local/var/log/mongodb/mongo.log'
    }
  },
  ok: 1
}
