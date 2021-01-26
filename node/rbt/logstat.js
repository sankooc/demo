const moment = require('moment');
moment.locale('zh-cn');
import mongoose from 'mongoose';
import { Store, Senddebug } from '../libs/models';
const XLSX = require('xlsx')
const os = require('os');
const fs = require('fs');
const createXLSXstream = (sheetName, data, writeStream) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { width: 50 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const tmpFile = `${os.tmpdir()}/${Date.now()}.xlsx`;
  XLSX.writeFileSync(wb, tmpFile);
  const clear = () => {
    if(fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  };
  const readStream = fs.createReadStream(tmpFile);
  readStream.pipe(writeStream).on('close', clear).on('error', clear).on('end', clear);
};

const ctx = {
  query: {
    start: '2017-12-12',
    end: '2017-12-12',
  }
};

(async function() {
  const start = '2019-05-01';
  const end = '2019-06-11';
  const startD = new Date(`${start}T00:00:00+0800`);
  const endD = new Date(`${end}T23:59:59+0800`);

  // Senddebug
  const $match = { at: { $gte: startD, $lt: endD }, 'actions.1': { $exists: true } };
  const $lookup = {
    from: 'stores',
    localField: 'store',
    foreignField: '_id',
    as: 'stores'
  };
  const $unwind = {
    path: '$stores',
    preserveNullAndEmptyArrays: true,
  };
  const $project = {
    store: 1,
    title: '$stores.t',
    done: {
      $cond: {
        if: { $lt: [{ $size: '$actions' }, 7] },
        then: 0,
        else: 1
      }
    }
  };
  const $group = { _id: '$store', title: { $first: '$title' }, total: { $sum: 1 }, success: { $sum: '$done' } };
  const items = await Senddebug.aggregate([{ $match }, { $lookup }, { $unwind }, { $project }, { $group }]);
  const sheetName = '统计';
  const data = [
    ['商店名', '总任务', '成功', '失败', '成功率']
  ];
  for(const item of items) {
    const { title, total, success } = item;
    const percent = total <= 0 ? 0 : ((success / total) * 100).toFixed(2) + '%';
    const failed = total - success;
    data.push([title, total, success, failed, percent])
  }
  
  const wsteam = fs.createWriteStream(__dirname+'/kakaka.xlsx');
  createXLSXstream(sheetName, data, wsteam);
  mongoose.disconnect();

})();

// console.log(moment().startOf('day').toDate())
// console.log(moment().endOf('day').toDate())
// console.log(new Date('2017-12-12T00:00:00+0800'));
