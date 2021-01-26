const XLSX = require('xlsx')
const wb = XLSX.utils.book_new();
const os = require('os');
const fs = require('fs');
const moment = require('moment');
import mongoose from 'mongoose';
import { Order, Record, User, Task, Transaction } from '../libs/models';

// const Schema = mongoose.Schema;
const { ObjectId } = require('mongodb');

// var ws_name = "SheetJS";

// var ws_data = [
//   [ "S", "h", "e", "e", "t", "J", "S" ],
//   [  1 ,  2 ,  3 ,  4 ,  5 ],
//   [  6 ,  5 ,  3 ,  4 ,  5 ]
// ];
// var ws = XLSX.utils.aoa_to_sheet(ws_data);

// /* Add the worksheet to the workbook */
// XLSX.utils.book_append_sheet(wb, ws, ws_name);
// const tmpFile = `${os.tmpdir()}/${Date.now()}.xlsx`;
// console.log(tmpFile);
// XLSX.writeFileSync(wb, tmpFile);
// const clear = () => {
//   fs.unlinkSync(tmpFile);
// };
// const readStream = fs.createReadStream(tmpFile);


// const wsteam = fs.createWriteStream('./demo.xlsx');


// readStream.pipe(wsteam).on('close', clear).on('error', clear).on('end', clear);


const write = async (opt) => {
  const { sname, data, cols } = opt;
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  if(cols) {
    ws['!cols'] = cols;
  }
  XLSX.utils.book_append_sheet(wb, ws, sname);
  const fm = './demo.xlsx';
  if(fs.existsSync('./demo.xlsx')) {
    fs.unlinkSync('./demo.xlsx');
  }
  XLSX.writeFileSync(wb, './demo.xlsx');
};

const orderStatusMap = {
  0: '未付款',
  1: '待发货',
  2: '待收货',
  3: '已收货',
  4: '已结算',
  5: '已取消',
  6: '退款中',
  7: '已退款',
  8: '已关闭',
};


function getOrderTransactionMap(transactionList) {
  const tempMap = {};
  transactionList.map((item) => {
    const idStr = item.order.toString();
    if (tempMap[idStr]) {
      tempMap[idStr].push(item);
    } else {
      tempMap[idStr] = [item];
    }
    return false;
  });
  return tempMap;
}

const originOrderPrices = (order, orderTransactionMap) => {
  let orderPrice = 0;
  for(const it of order.items) {
    orderPrice += Number(it.amount * it.p);
  }
  let orderRealyPay = 0;
  const orderTransactions = orderTransactionMap[(order._id || order.id).toString()] || [];
  orderTransactions.map((item) => {
    orderRealyPay += item.amount;
    return false;
  });
  let orderBoon = 0;
  if (order.status === 7 && !orderRealyPay) {
    orderBoon = 0;
  } else {
    // 没退款，  部分退款  优惠正常
    orderBoon = orderPrice - order.total;
  }
  console.dir(order);
  console.log(orderPrice, orderRealyPay, orderBoon);
};

const appendpipe = (pipes, model, localField, unwind) => {
  const $lookup = {
    from: model,
    localField,
    foreignField: '_id',
    as: `_${localField}`
  };
  pipes.push({ $lookup });
  if(unwind) {
    const $unwind = {
      path: `$_${localField}`,
      preserveNullAndEmptyArrays: true,
    };
    pipes.push({ $unwind });
  }
};


const orderPrices = (order) => {
  const items = order.items || [];
  const transactions = order.transactions || [];
  const boons = order.boons || [];
  const total = items.reduce((rt, cu) => rt + (cu.amount * cu.p), 0);
  const real = transactions.reduce((rt, trs) => {
    if(trs.data.result_code === 'SUCCESS') {
      return rt + trs.amount;
    }
    return rt;
  }, 0);
  const cut = boons.reduce((rt, bn) => rt + bn.cut, 0);
  return { total, real, cut };
};
const ccy = price => (price / 100).toFixed(2);

const converOrder = (list, data) => {
  for(const order of list) {
    const { total, real, cut } = orderPrices(order);
    const { no, nickname, mobile, d, at, status } = order;
    data.push([no, nickname, mobile, d, ccy(total), ccy(real), ccy(cut), moment(at).format('YYYY-MM-DD HH:mm:ss'), orderStatusMap[status] || status]);
  }
};

const loadOrders = async (filter, skip, limit) => {
  const pipes = [{ $match: filter }];
  appendpipe(pipes, 'users', 'user', true);
  // appendpipe(pipes, 'stores', 'store', true);
  appendpipe(pipes, 'orderitems', 'items', false);
  {
    const $lookup = {
      from: 'transactions',
      localField: '_id',
      foreignField: 'order',
      as: 'transactions'
    };
    pipes.push({ $lookup });
  }
  {
    const $project = {
      no: 1,
      p: 1,
      d: 1,
      at: 1,
      status: 1,
      boons: 1,
      nickname: '$_user.nickname',
      mobile: '$_user.mobile',
      // user: '$_user',
      // store: '$_store',
      items: '$_items',
      transactions: '$transactions',
    };
    pipes.push({ $project });
  }
  if(skip >= 0) {
    pipes.push({ $skip: skip });
  }
  if(limit >= 0) {
    pipes.push({ $limit: limit });
  }
  return Order.aggregate(pipes);
};




const agg1 = async () => {
  const start = '1565147939127';
  const end   = '1565238639296';
  const id = '5cdfa480e9778f02c24355c1';
  const s = new Date(parseInt(start, 10));
  const e = new Date(parseInt(end, 10));
  const filter = {
    store: ObjectId(id),
    status: { $gt: 0 },
    at: {
      $gte: s,
      $lt: e,
    }
  };

  const data = [];
  const list = await loadOrders(filter);
  converOrder(list, data);
  return data;
};

const start = async () => {
  const data = await agg1();


  // const start = '1565147939127';
  // const end   = '1565238639296';
  // const id = '5cdfa480e9778f02c24355c1';
  // const s = new Date(parseInt(start, 10));
  // const e = new Date(parseInt(end, 10));
  // const filter = {
  //   store: ObjectId(id),
  //   status: { $gt: 0 },
  //   at: {
  //     $gte: s,
  //     $lt: e,
  //   }
  // };
  // const pipes = [{ $match: filter }];
  // appendpipe(pipes, 'users', 'user', true);
  // // appendpipe(pipes, 'stores', 'store', true);
  // appendpipe(pipes, 'orderitems', 'items', false);
  // {
  //   const $lookup = {
  //     from: 'transactions',
  //     localField: '_id',
  //     foreignField: 'order',
  //     as: 'transactions'
  //   };
  //   pipes.push({ $lookup });
  // }
  // {
  //   const $project = {
  //     no: 1,
  //     p: 1,
  //     d: 1,
  //     at: 1,
  //     status: 1,
  //     boons: 1,
  //     nickname: '$_user.nickname',
  //     mobile: '$_user.mobile',
  //     // user: '$_user',
  //     // store: '$_store',
  //     items: '$_items',
  //     transactions: '$transactions',
  //   };
  //   pipes.push({ $project });
  // }
  // // {
  // //   pipes.push({ $skip: 0 }, { $limit: 3 });
  // // }
  // const list = await Order.aggregate(pipes);
  // console.log(list);
  // const list = await loadOrders(filter);
  // console.log(list.length);

  // const data = [];
  // converOrder(list, data);
  // console.log(data)
  // const list = await Order.find(filter)
  //   .populate('store user items')
  //   .sort('-at');

  // const transactionList = await Transaction.find({ order: { $in: list.map(ll => ll.id) }, 'data.result_code': 'SUCCESS' }).sort('-at');
  // // console.log(transactionList.length);
  // const orderTransactionMap = getOrderTransactionMap(transactionList);
  // const data = list.map((order) => {
  //   const item = order.toJSON();
  //   // const p = originOrderPrices(item, orderTransactionMap);
  //   return [item.no, item.user.nickname, item.user.mobile, item.d, moment(item.at).format('YYYY-MM-DD HH:mm:ss'), orderStatusMap[item.status] || item.status];
  // });

  const header = ['订单号', '昵称', '手机号', '订单简述', '订单价格', '实付价格', '折扣价格', '下单时间', '状态'];
  const cols = [
    { width: 15 },
    { width: 20 },
    { width: 15 },
    { width: 60 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 40 },
    { width: 10 },
  ];
  data.unshift(header);
  await write({ cols, data, sname: 'dingdan' });
  // 订单号 昵称 手机号 商品*数量 订单金额 实付金额 下单时间
  mongoose.disconnect();
};

(start)();