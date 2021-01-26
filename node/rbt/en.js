// const util = require('../src/utils');


// const option = {
//    sessionKey: 'Ek0yUvB9Mpd8A8OsPAJR6w==',
//    encryptedData: 'hf26B2fr0znqeqcrk0Wy8ib5wg/Avj1B5M/rZ3/Iqe3hoQ/ujYHGXDftVmJ1ZN3N817+FpPBj8jOW/4K0J6ST+sl+97HdcmRCbEgvnGqGjgvE0RnucRXw9zydQpqRjqc0DApOag4Jc2I3nC2GSTuSyqHRwhZnlTpIfRx39/azuePSpAURkI+NWnKjzP5KCGRPi1AsoXaBsy7edO9pUoHgw==',
//    iv: 'p4R8XNPVH6xdns/vxRpZZA=='
//   }


// console.log(util.encrypte(option));


const moment = require('moment');
moment.locale('zh-cn');

// 00
// index.jsx:354 57600000
// 1583510403000
// index.jsx:353 3000
// index.jsx:354 1583539203000
// index.jsx:355 -28800000


// const time = 1583510403000;

// const m = moment(time);

// console.log(m.format('YYYY-MM-DD HH:mm:ss'));

// const tod = 1000 * 60 * 60 * 24;
// const offset = 1000 * 60 * 60 * 8;
// const now = Date.now();
// console.log(moment(now).format('YYYY-MM-DD HH:mm:ss'));
// console.log(now - time);
// console.log(tod);
// console.log('---');
// const mod = (time + offset) % tod;
// console.log(mod);
// const mc = Math.floor((now + offset) / tod);
// // const mc2 = Math.floor((time + offset) / tod);
// const inn = mc * tod - offset + mod;
// console.log(moment(inn).format('YYYY-MM-DD HH:mm:ss'));
// console.log(inn);
// console.log(inn - time);


// const m = moment().day();
// console.log(m);
// console.log(moment().date());

   // latitude: 纬度的值, 
   // longitude: 经度的值


// 'point(116.602352 40.079641)'
// 'point(116.526907 40.02333)'

// 'point(116.690844 40.059602)'
   //  `select *, st_distance(OFFICE.LOC, 'point(116.526907 40.02333)') AS distance from OFFICE where st_distance(pt, 'point(116.526907 40.02333)')> 1  order by st_distance(pt, 'point(116.526907 40.02333)') desc;`



   //  SELECT * FROM OFFICE order st_distance(OFFICE.LOC, 'point(116.602266 40.044359)') desc



// var ObjectId = require("bson-objectid");

// console.log(ObjectId().toString());
// console.log(ObjectId().toString());
// console.log(ObjectId().toString());
// console.log(ObjectId().toString());


// const _ = require('lodash');


// const a = {};

// _.set(a, 'items[0].url', { aaah: 1 });

// _.set(a, 'items[0].url2', { aaah: 2 });
// console.dir(a);



const util = require('../src/model/util');

const pas  = util.hashpass('pass');
console.log(pas);
