/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable prefer-template */
/* eslint-disable no-path-concat */
/* eslint-disable no-loop-func */
const mongoose = require('mongoose');
const { parse } = require('node-xlsx');
const XLSX = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');
const db = require('../libs/models');
const xls = require('../service/xls');
const stat = require('../service/stat');
const { ObjectId } = require('mongodb');
require('../prepare');


const createReader = (tab, { valid }) => {
  const { data } = tab;
  const len = data.length;
  const offset = { left: 0, top: 1 };

  const swap = (row, inx) => {
    const str = row[inx];
    // console.log(inx, row);
    if(!str) return '';
    if(str.length < 1) {
      return '';
    }
    return str.replace(/^`([\S\s]+)$/, '$1');
  };
  const firstIndex = (() => {
    let inx = offset.top;
    while(inx < len) {
      if(!valid) break;
      if(valid(index => swap(data[inx], index))) break;
      inx += 1;
    }
    return inx;
  })();
  const lastIndex = (() => {
    let inx = len - 1;
    while(inx > offset.top) {
      if(!valid) break;
      if(valid(index => swap(data[inx], index))) break;
      inx -= 1;
    }
    return inx;
  })();
  const first = data[firstIndex];
  const last = data[lastIndex];
  let cursor = firstIndex;
  return {
    first: inx => swap(first, inx),
    last: inx => swap(last, inx),
    next: () => {
      if(cursor < 0) return null;
      const d = data[cursor];
      if(cursor >= lastIndex) {
        cursor = -1;
      } else {
        while(cursor < lastIndex) {
          cursor += 1;
          if(!valid) break;
          if(valid(index => swap(data[cursor], index))) break;
        }
      }
      return inx => swap(d, inx);
    },
    all: function all(wrap) {
      let row = this.next();
      const items = [];
      while(row) {
        items.push(wrap(row));
        row = this.next();
      }
      return items;
    },
  };
};

const xlsxBatchReader = (reader, num = 2) => {
  let row = reader.next();
  const read = () => {
    const no = row(1);
    const transaction = row(2);
    const real = row(6);
    const order = row(10);
    const status = row(4);
    const fstr = row(9);
    const fee = fstr.replace(/^[\S\s]*手续费\s*([\d.]+)\s*元$/, '$1');
    const base = { no, transaction, order };
    base.real = Math.round(parseFloat(real) * 100);
    base.fee = Math.round(parseFloat(fee) * 100);
    row = reader.next();
    if(status === '交易') {
      return { ...base, status: 'pay' };
    }
    base.real += base.fee;
    return { ...base, status: 'refund' };
  };
  return () => {
    const items = [];
    while(row) {
      items.push(read());
    }
    return items;
  };
  // return () => {
  //   const arr = [];
  //   for(let i = 0; i < num; i += 1) {
  //     if(!row) break;
  //     arr.push(read());
  //   }
  //   return arr;
  // };
};

const gennal = (gen) => {
  const identity = s => s.no;
  const bucket = {};
  let last = {};
  let cur = {};
  return {
    flush: () => {},
    batch: async () => {
      const data = await gen();
      cur = _.keyBy(data, identity);
      const acc = { ...last, ...cur };
      return Object.keys(acc);
    },
    back: (extra) => {
      Object.assign(bucket, _.pick(last, ...extra));
      last = _.pick(cur, ...extra);
      cur = {};
    }
  };
};

const dataSourceDiff = async (ops, gen1, gen2) => {
  // const identity = s => s.no;
  // const bucket = 2;
  // const comps = sources.map(keyGen);
  // const bucket1 = {};
  // let last1 = {};
  // const data1 = await gen1();
  // const sm1 = _.keyBy(data1, identity);
  // const acc = { ...last1, ...sm1 };
  // //
  // // const extra;
  // Object.assign(bucket1, _.pick(last1, ...extra));
  // last1 = _.pick(sm1, ...extra);
};

(async () => {
  const filepath = __dirname + '/demo_1.xlsx';
  const mch_id = '1383608902';
  
  // const tabs = parse(filepath);
  // const batch_num = 10;

  // const reader = createReader(tabs[0], { valid: (row) => {
  //   const order = row(10);
  //   if(!order) return false;
  //   const status = row(4);
  //   return (status === '交易' || status === '退款');
  // } });
  // const start = moment(reader.first(0)).subtract(3000, 'milliseconds').toDate();
  // const end = moment(reader.last(0)).add(3000, 'milliseconds').toDate();
  // const filter = {
  //   at: {
  //     $gte: start,
  //     $lte: end,
  //   },
  //   'data.mch_id': mch_id,
  //   'data.result_code': 'SUCCESS',
  // };
  // const ts = await db.Transaction.find(filter, 'amount order data');
  // const trans = ts.map((t) => {
  //   const tobj = t.toObject();
  //   const it = _.omit(tobj, 'data');
  //   it.mch_id = tobj.data.mch_id;
  //   it.real = tobj.amount;
  //   it.transaction = tobj.data.transaction_id;
  //   if(it.amount >= 0) {
  //     it.no = tobj.data.transaction_id;
  //     it.status = 'pay';
  //   } else {
  //     it.no = tobj.data.refund_id;
  //     it.status = 'refund';
  //   }
  //   return it;
  // });
  // console.log(trans);
  // const rs = await stat.match({ filepath, mch_id });


  const goodex = await db.GoodExt.findOne({ good: '5db9337a102c5c0ba1f33e2a' });
  console.log(goodex.stock);
  mongoose.disconnect();

  // const file = '/Users/yj431/demo.xlsx';
  // if (fs.existsSync(file)) fs.unlinkSync(file);
  // const wb = await xls.diff(rs);
  // const buf = await xls.toStream(wb, 'buffer');
  // fs.writeFileSync(file, buf);

  // const wrap = (row) => {
  //   const no = row(1);
  //   const transaction = row(2);
  //   const real = row(6);
  //   const order = row(10);
  //   const status = row(4);
  //   const fstr = row(9);
  //   const fee = fstr.replace(/^[\S\s]*手续费\s*([\d.]+)\s*元$/, '$1');
  //   const base = { no, transaction, order };
  //   base.real = Math.round(parseFloat(real) * 100);
  //   base.fee = Math.round(parseFloat(fee) * 100);
  //   if(status === '交易') {
  //     return { ...base, status: 'pay' };
  //   }
  //   base.real += base.fee;
  //   return { ...base, status: 'refund' };
  // };
  // const full = reader.all(wrap);
  // // const full = xlsxBatchReader(reader)();

  // const identity = s => s.no;
  // const dbstr = trans.map(identity);
  // const dbxtr = full.map(identity);
  // const k1 = _.keyBy(trans, identity);
  // const k2 = _.keyBy(full, identity);
  // const macths = _.intersection(dbstr, dbxtr);
  // const rs = {
  //   acms: {
  //     name: '系统溢出',
  //     items: [],
  //   },
  //   out: {
  //     name: '支付系统溢出',
  //     items: [],
  //   },
  //   diffs: [],
  // };
  // if(dbstr.length !== macths.length) {
  //   const dp = _.omit(k1, ...macths);
  //   rs.acms.items = Object.values(dp);
  // }
  // if(dbxtr.length !== macths.length) {
  //   const dp = _.omit(k2, ...macths);
  //   rs.out.items = Object.values(dp);
  // }
  // for(const no of macths) {
  //   if(Math.abs(k1[no].real) !== Math.abs(k2[no].real)) {
  //     const { status, transaction } = k1[no];
  //     rs.diffs.push({ no, status, transaction, acms: Math.abs(k1[no].real), out: Math.abs(k2[no].real) });
  //   }
  // }
  // console.log(rs.out.items);
  // const { first, last } = reader;
  // const workbook = XLSX.readFile(filepath);
  // console.log(workbook);
})();
