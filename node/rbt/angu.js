// // const moment = require('moment');


// // console.log(moment().subtract(3, 'days').format('YYYY-MM-D'));



// const Order = require('../libs/models/Order');
// const { ObjectId } = require('mongodb');

// require('../prepare');

// (async () => {
//   const orderList = await Order.find({ status: 7, store: ObjectId('5d087be413f22c6a8c6fb447') })
//     .populate('store')
//     // .deepPopulate('items.version items.good')
//     // .sort('-at');
//   console.log(orderList);
// })();


// //a8c95224053a4fdfbe895391987deba1



try{
  console.log('1');
  const apm = require('elastic-apm-node').start({
    serviceName: 'acms',
    serverUrl: 'http://172.17.56.3:8200',
    secretToken: '34eede3f-275a-4b79-bcf8-9c1dfbf08',
  });
  
  console.log('2');
  const trans = apm.startTransaction('job1', 'job');
  trans.result = 'error';

  console.log('3');
  trans.end();

  console.log('4');
}catch(e){
  console.error(e)
}

