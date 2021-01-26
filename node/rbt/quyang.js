const fs = require('fs');
const _ = require('lodash');
const {
  exec,
} = require('child_process');
// const moment = require('moment');
// const Excel = require('exceljs');
// const xl = require('excel4node');
// const orderService = require('../libs/services/orderStatisticsService');

const xls = require('../service/xls');


// (async () => {
//   const workbook = new Excel.Workbook();
//   await workbook.xlsx.readFile(__dirname + '/xlsx/tt1.xlsx');
//   // workbook.eachSheet((worksheet, sheetId) => {
//   //   console.log(sheetId);
//   // });
//   const sheet = workbook.getWorksheet(3);
//   console.log(sheet.views);
// })();

(async () => {
  const target = `${__dirname}/out.xlsx`;
  if(fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
  const workbook = xls.repe();
  workbook.write(target, (err, st) => {
    const cmd = 'open out.xlsx';
    exec(cmd, {
      cwd: __dirname,
    }, (err, stdout, stderr) => {
      console.log(err);
    });
  });
  // xls.dailyOrderStat(date, rs, 120, target);
  // console.log('geresult');
  // const wb = new xl.Workbook();
  // const ws = wb.addWorksheet(`${date} 销售日报`);
  // ws.column(1).setWidth(8);
  // ws.column(2).setWidth(40);
  // ws.column(3).setWidth(12);
  // ws.column(4).setWidth(14);
  // ws.column(5).setWidth(14);
  // ws.column(6).setWidth(14);
  // let row = 1;
  // const tdate = moment(date).format('MM月DD日');
  // const ydate = moment(date).subtract(1, 'days').format('MM月DD日');
  // const mdate = moment(date).month();
  // const ct = wb.createStyle({
  //   border: {
  //     right: { style: 'thin' },
  //     bottom: { style: 'thin' },
  //   },
  // });
  // const ct2 = wb.createStyle({
  //   border: {
  //     top: { style: 'thin' },
  //     right: { style: 'thin' },
  //     bottom: { style: 'thin' },
  //   },
  // });
  // const ct3 = wb.createStyle({
  //   border: {
  //     top: { style: 'thin' },
  //     right: { style: 'thin' },
  //     bottom: { style: 'thin' },
  //     left: { style: 'thin' },
  //   },
  // });
  // const ct4 = wb.createStyle({
  //   border: {
  //     left: { style: 'thin' },
  //     right: { style: 'thin' },
  //     bottom: { style: 'thin' },
  //   },
  // });
  // ws.cell(row, 1).string('房间数').style(ct3);
  // ws.cell(row, 2).string('酒店').style(ct2);
  // ws.cell(row, 3).string('开店时间').style(ct2);
  // ws.cell(row, 4).string(`${ydate}订单金额`).style(ct2);
  // ws.cell(row, 5).string(`${tdate}订单金额`).style(ct2);
  // ws.cell(row, 6).string(`${mdate + 1}月合计金额`).style(ct2);
  // row += 1;
  // for(const item of Object.values(rs)) {
  //   ws.cell(row, 1).number(item.position).style(ct4);
  //   ws.cell(row, 2).string(item.t).style(ct);
  //   ws.cell(row, 3).string(moment(item.at).format('YYYY-MM-DD')).style(ct);
  //   ws.cell(row, 4).number(item.yesterday / 100).style(ct);
  //   ws.cell(row, 5).number(item.today / 100).style(ct);
  //   ws.cell(row, 6).number(item.month / 100).style(ct);
  //   row += 1;
  // }
  // const flagStyle = wb.createStyle({
  //   font: {
  //     bold: true,
  //     // color: 'FFFF99',
  //   },
  //   fill: {
  //     type: 'pattern',
  //     bgColor: 'FFFF99'
  //   },
  // });
  // const getRule = () => {
  //   const rule = {
  //     type: 'cellIs',
  //     priority: 1,
  //     operator: 'greaterThan',
  //     formula: flag,
  //     style: flagStyle,
  //   };
  //   return rule;
  // };

  // ws.addConditionalFormattingRule(`D2:D${row - 1}`, getRule());
  // ws.addConditionalFormattingRule(`E2:E${row - 1}`, getRule());
  // wb.write(target);


  // const date = '2019-10-21 12:00:00';
  // const oid = '5d6e0c606605d128e29011f4';
  // // const oid = '5ce001a9dae382140aa6dc4a';
  // // const date = '2019-09-08 12:00:00';
  // console.time('start');
  // await orderService.storeDailyStat(oid, date);
  // console.timeEnd('start');
})();
