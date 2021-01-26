// const hashes = require('bling-hashes');
// const hash = hashes.bkdr(100);
// console.log(hash);




// // const strong = (h) => {
// //   const hash = (s, a, b, c) => {
// //     if (!s || s.length === 0) return 0;
// //     var c = h(s, a, b, c);
// //     return parseInt(''+c+s.length);
// //   };
// //   hash.hash = h;
// //   return hash;
// // };

// const bkdr = (obj, seed = 131) => {
//   if(!obj) return 0;
//   const str = obj.toString();
//   let hash = 0;
//   for (let i = 0; i < str.length; i += 1) {
//     const ch = str.charCodeAt(i);
//     hash = hash * seed + ch;
//   }
//   return hash & 0x7fffffff;
// };

// console.log(bkdr('100'));


// const { upload } = require('../libs/upyun');

// (async () => {
//   const yo = async (fname) => {
//     const f = `${__dirname}/${fname}`;
//     const res = await upload('assets', fname, f);
//     const url = `http://images.sp.yunjichina.com.cn/${res.key}`;
//     console.log(url);
//   };
//   await yo('jquery.min.js');
//   await yo('jquery.touchSwipe.min.js');
//   await yo('jquery.qrcode.min.js');
// })();

// 'http://images.sp.yunjichina.com.cn/assets/jquery.min.js';
// const bluebird = require('bluebird');
// const request = require('request-promise');
// global.Promise = bluebird;
// (async() => {
//   const sq = new Promise(async (resolve) => {
//     await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     resolve('ok');
//     console.log('ok-it');
//   });

//   await Promise.each(1, async () => [new Promise(async (resolve) => {
//     await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     // await request.get('https://www.baidu.com');
//     resolve('ok');
//     console.log('ok-it');
//   })]);

// })();

const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);

console.log(array1);
console.log(array2);
console.log(array3);

