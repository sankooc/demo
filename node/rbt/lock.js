// const storeService = require('../service/store');


// (async () => {
//   const s = storeService.createStore();
// })();


// const find = require('phone-query');
// console.log(find(15010130247));

// const mongoose = require('mongoose');
// const db = require('../libs/models');
// const stat = require('../service/stat');

// (async () => {
//   await stat.create(db).roll();
//   mongoose.disconnect();
// })();

// const swap = (fname, name) => {
//   if(/^[\S\s]*\.\w+$/.test(fname)) {
//     return fname.replace(/^[\S\s]*(\.\w+)$/, `${name}$1`);
//   }
//   return fname;
// };

// console.log(swap('fjdd$213 diad.mp3', '2222'));



// (async () => {
//   const s = storeService.createStore();
// })();
// const data = 'abcccdsdasdwdsaraeweqdsad';

// const buf = Buffer.from(data);
// const b = buf.toString('hex');
// console.log(b);

// const len = b.length;
// const rat = len / 2;
// let mask = 0;
// let last;
// for(let i = 0; i < rat; i += 1) {
//   const v = buf.readInt8(i);
//   mask ^= v;
//   last = v;
//   // console.log(v.toString(16));
// }
// console.log('mask', mask);

// const data = Buffer.alloc(rat);

// for(let i = rat; i > 0 ; i -= 1) {
//   buf.writeUInt8(last, i - 1);
//   mask ^= last;
//   last = last ^ mask
// }



// // console.log(parseInt(61, 16));

// // const a = {
// //   kda: 1,
// //   pending: function(a, b){
// //     console.log(this.kda, a, b);
// //   }
// // }

// // a.pending('1', '33');


// // const fn = a.pending.bind(a)
// // fn('22', '44')




// const _ = require('lodash');



// const a = ['aa', 'cc', 'kk', 'dd', 'aa', 'kk'];
// const p = _.uniq(a);
// // console.log(p);
// const b = ['dd', 'ew', 'dsa', 'aa'];

// const rs = _.intersection(p, b);

// console.log(rs);

// const BSON = require('bson');
// const Long = BSON.Long;

// // Serialize a document
// const doc = { long: 'aa' };
// const data = BSON.serialize(doc);
// console.log('data:', data.toString('hex'));

// 5a4671f2 53031a 1c84 bf0b8d
// 5a606b28 8e0207 1c8b 1f3a1a
// // Deserialize the resulting Buffer
// const doc_2 = BSON.deserialize(data);
// console.log('doc_2:', doc_2);


const path = require('path');

const a = path.join('/images.sp.yunjichina.com.cn/', 'goood/ds');
console.log(a);
