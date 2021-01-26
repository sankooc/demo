/* eslint-disable no-multi-spaces */
/* eslint-disable space-before-blocks */
/* eslint-disable prefer-object-spread */
const xl = require('excel4node');
const { parse } = require('node-xlsx');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const os = require('os');
const log4js = require('log4js');
const mime = require('mime');

const logger = log4js.getLogger('default');

const mm = (num, size = 2) => parseFloat(num.toFixed(size)) || 0;
const nn = (num, size = 2) => mm(num / 100, size);
const dt = d => moment(d).format('YYYY-MM-DD HH:mm:ss');
const emun = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


const curStyle = {
  alignment: { horizontal: 'right', vertical: 'center' },
  numberFormat: '￥#,##0.00;￥-#,##0.00',
};

const getE = (num) => {
  let off = num;
  let str = '';
  while(true) {
    const c = off % 26;
    str += emun.charAt(c);
    if((off / 26) < 1) {
      break;
    }
    off = Math.floor(off / 26) - 1;
  }
  return str;
};

const bord = (wb, left, right, top, bottom) => {
  const s = { style: 'thin' };
  const rn = { border: {} };
  if(left) rn.border.left = s;
  if(right) rn.border.right = s;
  if(top) rn.border.top = s;
  if(bottom) rn.border.bottom = s;
  return wb.createStyle(rn);
};
const sheetViewer = (ws, meta) => {
  const imeta = Object.assign({}, meta);
  imeta.width = 0;
  imeta.height = 0;
  let row = imeta.top + 1;
  let col = imeta.left + 1;
  return {
    next: (inx = 1) => {
      const cell = ws.cell(row, col);
      imeta.width = Math.max(col - imeta.left, imeta.width);
      col += inx;
      return cell;
    },
    skip(inx = 1) {
      imeta.width = Math.max(col - imeta.left, imeta.width);
      col += inx;
    },
    merge: (x1, y1, x2, y2, m = true) => {
      // console.log('----- merge: ', x1, y1, x2, y2); // -1 -7 0 0
      // console.log('----- row, col: ', row, col); // 2 9
      const cell = ws.cell(x1 + row - 1, y1 + col - 1, x2 + row - 1, y2 + col - 1, m);
      imeta.width = Math.max(col - imeta.left, imeta.width);
      col += y2;
      return cell;
    },
    enter: () => {
      row += 1;
      col = imeta.left + 1;
      imeta.height = (row - imeta.top);
    },
    columns: (...wids) => {
      for(let i = 0; i < wids.length; i += 1) {
        ws.column(i + 1 + imeta.left).setWidth(wids[i]);
      }
    },
    setHeight: (r, height) => {
      ws.row(r).setHeight(height);
    },
    border: () => {

    },
    meta: () => imeta
  };
};

const setBorder = (wb, ws, meta) => {
  const { left, top, width, height } = meta;
  const co1 = bord(wb, 1, 1, 1, 1);
  const co2 = bord(wb, 0, 1, 1, 1);
  const co3 = bord(wb, 1, 1, 0, 1);
  const style = bord(wb, 0, 1, 0, 1);
  for(let i = 1; i <= height; i += 1) {
    for(let j = 1; j <= width; j += 1) {
      if(i === 1 && j === 1) {
        ws.cell(i + top, left + j).style(co1);
      } else if(i === 1) {
        ws.cell(i + top, left + j).style(co2);
      } else if(j === 1) {
        ws.cell(i + top, left + j).style(co3);
      } else {
        ws.cell(i + top, left + j).style(style);
      }
    }
  }
};

const cellCIndex = (cell) => {
  const { firstRow, firstCol } = cell;
  return { row: firstRow, col: firstCol };
};

const cellIndex = (cell) => {
  const { firstRow, firstCol } = cell;
  // console.log(firstCol, firstRow);
  return `${getE(firstCol - 1)}${firstRow}`;
};

const monthOrderStatSheet = (ws, items) => {
  const viewer = sheetViewer(ws, { left: 0, top: 0 });
  const head = ['酒店', '任务数', '扫码次数', '新增用户', '订单总数', '有效订单数', '扫码-订单转化率', '用户-订单转化率', '本月累计订单金额', '本月累计实收金额', '本月目标金额', '理论差额', '实际差额', '每日理论目标', '每日实际目标', '客单价', '退款订单数', '退款金额'];
  for(const h of head) {
    viewer.next().string(h);
  }
  const c = (cel, v) => {
    if(v === '-') {
      cel.string('-');
    } else {
      cel.number(nn(v));
    }
    return cel;
  };
  for(const item of items) {
    viewer.enter();
    viewer.next().string(item.t);
    viewer.next().number(item.tasks);
    viewer.next().number(item.scans);
    viewer.next().number(item.users);
    viewer.next().number(item.orderCount);
    viewer.next().number(item.effective);

    viewer.next().number(mm(item.convert, 3));
    viewer.next().number(mm(item.uconvert, 3));

    viewer.next().number(nn(item.oprice, 3));
    viewer.next().number(nn(item.real, 3));

    c(viewer.next(), item.objective);

    viewer.next().number(nn(item.lilun));
    viewer.next().number(nn(item.shiji));

    c(viewer.next(), item.dlilun);
    c(viewer.next(), item.dshiji);

    viewer.next().number(nn(item.kedan));
    viewer.next().number(item.refundCount);
    viewer.next().number(nn(item.refund));
  }
  return viewer.meta();
};

const render = async (sheet, file, hander) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(sheet);
  await hander(wb, ws);
  return new Promise((resolve, reject) => {
    wb.write(file, (err, st) => {
      if(err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
};

function smalltoBIG(n) {
            var fraction = ['角', '分'];
            var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
            var unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            var head = n < 0 ? '欠' : '';
            n = Math.abs(n);

            var s = '';

            for (var i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);

            for (var i = 0; i < unit[0].length && n > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
        }

// invoicesSupplyStatSheet
function invoicesSupplySheet(ws, item, wb) {
  const viewer = sheetViewer(ws, { left: 0, top: 0 });
  delete(item.store)
  let rowNum = 23;
  if(item.items.length > 5) rowNum += (item.length - 5);
  const cols = ['','','','','','','',''];
  for(let i = 0; i < rowNum; i ++) {
    viewer.setHeight(i+1, 40);
    if(i < rowNum -1){
      viewer.enter();
      for(let j = 0; j < cols.length; j ++ ){
        viewer.next();
      }
    }
  }
  viewer.columns(6 * 2, 12 * 2, 12 * 2, 8 * 2, 8* 2, 8* 2, 6* 2, 12* 2);
  // 第一行 第二行
  const styleTitle = {
    alignment:{
      horizontal:'center',
      vertical:'center'
    },
    font: {
      bold: true,
      size: 28
    },
    border:{
      left: {
        style: 'none',
        color: '#ffffff'
      },
      right: {
        style: 'none',
        color: '#ffffff'
      },
      top: {
        style: 'none',
        color: '#ffffff'
      },
      bottom: {
        style: 'thick',
        color: '#000000'
      }
    }
  };
  const styleDataLeft = { alignment:{ horizontal:'left', vertical:'center'}, font:{ bold: false, size: 20 }};
  const styleDataCenter = { alignment:{ horizontal:'center', vertical:'center' }, font:{ bold: false, size: 20 }};
  const styleDataCenterRotation = { alignment:{ horizontal:'center', vertical:'center', wrapText: true }, font:{ bold: false, size: 20 }};
  // alignment
  ws.cell(1,1,2,8,true).string('发票申请单').style(styleTitle);

  // 第三行
  let currentRow = 3;
  ws.cell(currentRow,1,currentRow,2,true).string('开票单位:').style(styleDataCenter);
  ws.cell(currentRow,3,currentRow,5,true).string('北京云迹科技有限公司').style(styleDataCenter);
  ws.cell(currentRow,6).string('合同编号:').style(styleDataCenter);
  ws.cell(currentRow,7,currentRow,8,true);

  // 第四行
  currentRow = 4;
  ws.cell(currentRow,1,rowNum-2,1,true).string('\n购\n货\n单\n位\n信\n息\n').style(styleDataCenterRotation);
  ws.cell(currentRow,2).string('申请人').style(styleDataLeft);
  ws.cell(currentRow,3,currentRow,4,true);
  ws.cell(currentRow,5).string('申请日期:').style(styleDataLeft);
  ws.cell(currentRow,6,currentRow,8,true).string(moment(item.at).format('YYYY/MM/DD')).style(styleDataCenter);

  // 第5行
  currentRow = 5;
  ws.cell(currentRow,2).string('纳税人状态').style(styleDataLeft);
  ws.cell(currentRow,3,currentRow,4,true).string('一般纳税人（ √ ）').style(styleDataLeft);
  ws.cell(currentRow,5,currentRow,8,true).string('小规模纳税人（  ）').style(styleDataCenter);

  currentRow = 6;
  ws.cell(currentRow,2).string('发票类型').style(styleDataLeft);
  let rightLogo0 = '增值税专用发票（ √ ）';
  let rightLogo1 = '增值税普通发票（  ）';
  if(item.type == 1){
    rightLogo0 = '增值税专用发票（  ）';
    rightLogo1 = '增值税普通发票（ √ ）';
  }
  ws.cell(currentRow,3,currentRow,4,true).string(rightLogo0).style(styleDataLeft);
  ws.cell(currentRow,5,currentRow,8,true).string(rightLogo1).style(styleDataCenter);

  currentRow = 7;
  ws.cell(currentRow,2).string('名 称').style(styleDataLeft);
  ws.cell(currentRow,3,currentRow,8,true).string(item.title || '').style(styleDataLeft);

  currentRow = 8;
  ws.cell(currentRow,2).string('纳税人识别号').style(styleDataLeft);
  ws.cell(currentRow,3,currentRow,8,true).string(item.invoiceId || '').style(styleDataLeft);

  currentRow = 9;
  ws.cell(currentRow,2).string('地址 电话').style(styleDataLeft);
  ws.cell(currentRow,3,currentRow,8,true).string((item.address || '') + '  ' + (item.tel || '') ).style(styleDataLeft);

  currentRow = 10;
  ws.cell(currentRow,2).string('开户行及账号').style(styleDataLeft);
  ws.cell(currentRow,3,currentRow,8,true).string((item.bank || '') + '  ' + (item.card || '') ).style(styleDataLeft);

  currentRow = 11;
  ws.cell(currentRow,2,rowNum-6,2,true).string('每张的开票内容').style(styleDataCenter);
  ws.cell(currentRow,3).string('产品名称').style(styleDataCenter);
  ws.cell(currentRow,4).string('型号').style(styleDataCenter);
  ws.cell(currentRow,5).string('数量').style(styleDataCenter);
  ws.cell(currentRow,6).string('单价').style(styleDataCenter);
  ws.cell(currentRow,7).string('税率').style(styleDataCenter);
  ws.cell(currentRow,8).string('金额').style(styleDataCenter);

  for(let it of item.items){
    currentRow += 1;
    ws.cell(currentRow,3).string('服务费').style(styleDataCenter);
    ws.cell(currentRow,6).string((it.itemP / 100).toFixed(2)).style(styleDataCenter);
  }

  currentRow = rowNum - 6;
  ws.cell(currentRow,3).string('小计').style(styleDataCenter);
  ws.cell(currentRow,6).string((item.p / 100).toFixed(2)).style(styleDataCenter);

  currentRow = rowNum - 5;
  ws.cell(currentRow,2).string('押金收据').style(styleDataCenter);

  currentRow = rowNum - 4;
  ws.cell(currentRow,2).string('备注').style(styleDataCenter);
  ws.cell(currentRow,3, currentRow, 8, true);

  currentRow = rowNum - 3;
  ws.cell(currentRow,2,currentRow + 1, 2,true ).string('开票金额合计（元）').style(styleDataCenter);
  ws.cell(currentRow,3).string('小写金额:').style(styleDataCenter);
  ws.cell(currentRow,4, currentRow, 8, true).string((item.p / 100).toFixed(2)).style(styleDataCenter);

  currentRow = rowNum - 2;
  ws.cell(currentRow,3).string('大写金额:').style(styleDataCenter);
  ws.cell(currentRow,4, currentRow, 8, true).string(smalltoBIG(item.p/100)).style(styleDataCenter);

  currentRow = rowNum - 1;
  ws.cell(currentRow,1).string('其他\n事项').style(styleDataCenter);
  ws.cell(currentRow,2, currentRow, 8, true);

  currentRow = rowNum;
  ws.cell(currentRow,1, currentRow, 2, true).string('开票人:').style(styleDataCenter);
  ws.cell(currentRow,4).string('领取人:').style(styleDataCenter);
  ws.cell(currentRow,5, currentRow, 8, true);

  return viewer.meta();
};

// 运营数据
const createOperationSheet = (wb, data) => {
  const { total, eqe, items } = data;
  const ws = wb.addWorksheet('运营数据');
  const viewer = sheetViewer(ws, { left: 0, top: 0 });
  const head = ['日期', '订单金额', '实收金额', '订单数', '有效订单数', '新建用户', '下单用户', '复购用户', '平均客单价'];
  for(const h of head) {
    viewer.next().string(h);
  }
  {
    viewer.enter();
    viewer.next().string('本月合计');
    viewer.next().number(nn(total.oprice));
    viewer.next().number(nn(total.real));
    viewer.next().number(total.orderCount);
    viewer.next().number(total.effective);
    viewer.next().number(total.users);
    viewer.next().number(total.ousers);
    viewer.next().number(total.dusers);
    viewer.next().number(nn(total.kedan, 3));
  }
  {
    viewer.enter();
    viewer.next().string('月均');
    viewer.next().number(nn(eqe.oprice));
    viewer.next().number(nn(eqe.real));
    viewer.next().number(eqe.orderCount);
    viewer.next().number(eqe.effective);
    viewer.next().number(eqe.users);
    viewer.next().number(eqe.ousers);
    viewer.next().string('-');
    viewer.next().string('-');
  }
  for(const it of items) {
    viewer.enter();
    viewer.next().string(it.date);
    viewer.next().number(nn(it.oprice));
    viewer.next().number(nn(it.real));
    viewer.next().number(it.orderCount);
    viewer.next().number(it.effective);
    viewer.next().number(it.users);
    viewer.next().number(it.ousers);
    viewer.next().string('-');
    viewer.next().string('-');
  }
  viewer.columns(10, 12, 12, 12, 12, 12, 12, 12, 10);
  const meta = viewer.meta();
  setBorder(wb, ws, meta);
}
// sku 数据
const createskuData = (wb, items, date) => {
  const ws = wb.addWorksheet('SKU数据');
  const viewer = sheetViewer(ws, { left: 0, top: 0 });
  const head = ['商品名称', '单价', '成本', '分类', '总数', '总价', '总成本', '有效总数', '有效总价', '有效总成本'];

  const start = moment(date).startOf('month').toDate();
  const end = moment(date).endOf('month').toDate();
  const now = Date.now();
  if(now < +start) throw new Error('date_out');
  const c = Math.min(now, +end);
  const lst = moment(c);
  const ds = [];
  while(lst.toDate().getTime() > +start) {
    const d = lst.format('YYYY-MM-DD');
    ds.push(d);
    lst.subtract(1, 'days');
  }
  _.reverse(ds);
  head.push(...ds);
  for(const h of head) {
    viewer.next().string(h);
  }
  for(const item of items) {
    viewer.enter();
    viewer.next().string(item.t);
    viewer.next().number(nn(item.p));
    viewer.next().number(nn(item.cost));
    viewer.next().string(item.category);
    viewer.next().number(item.amount);
    viewer.next().number(nn(item.ap));
    viewer.next().number(nn(item.acost));
    viewer.next().number(item.effct);
    viewer.next().number(nn(item.total));
    viewer.next().number(nn(item.tcost));
    for(const d of ds) {
      if(item.dates[d]) {
        viewer.next().number(item.dates[d].amount || 0);
      } else {
        viewer.next().number(0);
      }
    }
  }
  const cl = [50, 8, 8, 12, 10, 10, 10, 10, 10, 10];
  cl.push(...ds.map(() => 12));
  viewer.columns(...cl);
  const meta = viewer.meta();
  setBorder(wb, ws, meta);
};

// sku 统计
const createSKUstat = (wb, data) => {
  const { total, items } = data;
  const ws = wb.addWorksheet('SKU统计');
  const viewer = sheetViewer(ws, { left: 0, top: 0 });
  const head = ['商品分类', '总数', '总价', '总成本', '有效总数', '有效总价', '有效总成本'];
  for(const h of head) {
    viewer.next().string(h);
  }

  {
    viewer.enter();
    viewer.next().string('合计');
    viewer.next().number(total.amount);
    viewer.next().number(nn(total.ap));
    viewer.next().number(nn(total.acost));
    viewer.next().number(total.effct);
    viewer.next().number(nn(total.total));
    viewer.next().number(nn(total.tcost));
  }
  for(const item of items) {
    viewer.enter();
    viewer.next().string(item.category);
    viewer.next().number(item.amount);
    viewer.next().number(nn(item.ap));
    viewer.next().number(nn(item.acost));
    viewer.next().number(item.effct);
    viewer.next().number(nn(item.total));
    viewer.next().number(nn(item.tcost));
  }
  const cl = [13, 10, 10, 10, 10, 10, 10];
  viewer.columns(...cl);
  const meta = viewer.meta();
  setBorder(wb, ws, meta);
};

exports.scenOrderStat = (items, file = `${os.tmpdir()}/xcache_${Date.now()}.xlsx`) => {
  // const data = [
  //   ['编号', '携程订单号', '订单状态', '消费店铺', '消费位置', '应付金额', '实付金额', '下单日期', '订单项', '微信支付单号', '手续费']
  // ];
  // for(const item of items) {
  //   data.push([item.orderSN, item.ctripOrderId, item._orderStatus, item.storeName, item.position, item._orderMoney, item._paymentMoney, item._createTime, item.detail, getT(item), item._shouxu ]);
  // }
  // const fileName = '携程订单统计';
  const items2 = [];
  const items3 = [];

  for(const item of items) {
    const status = item[11];
    switch(status) {
      case 0:
      case 7:
      case 8:
        items3.push(item);
        break;
      default:
        items2.push(item);
    }
    items2.push();
  }

  const wb = new xl.Workbook();

  const crea = (data, sname) => {
    const head = ['编号', '携程订单号', '订单状态', '消费店铺', '消费位置', '应付金额', '实付金额', '下单日期', '订单项', '微信支付单号', '手续费'];
    const ws = wb.addWorksheet(sname);
    const viewer = sheetViewer(ws, { left: 0, top: 0 });
    for(const h of head) {
      viewer.next().string(h);
    }
    for(const item of data) {
      viewer.enter();
      viewer.next().string(item[0]);
      viewer.next().string(item[1]);
      viewer.next().string(item[2]);
      viewer.next().string(item[3]);
      viewer.next().string(item[4]);
      viewer.next().number(item[5]);
      viewer.next().number(item[6]);
      viewer.next().string(item[7]);
      viewer.next().string(item[8]);
      viewer.next().string(item[9]);
      viewer.next().number(item[10]);
    }
    viewer.columns(14, 14, 10, 22, 10, 10, 10, 15, 20, 15, 10);
    return { ws, viewer };
  };

  {
    const { viewer, ws } = crea(items2, '已付款订单');
    viewer.enter();
    viewer.next().string('合计');
    viewer.next(4);
    const { left, top, height } = viewer.meta();
    const t1 = top + 2;
    const t2 = top + height - 1;
    {
      const c = getE(left + 5);
      const cell = viewer.next();
      cell.formula(`SUM(${c}${t1}:${c}${t2})`);
    }
    {
      const c = getE(left + 6);
      const cell = viewer.next();
      cell.formula(`SUM(${c}${t1}:${c}${t2})`);
    }
    viewer.next(3);
    {
      const c = getE(left + 10);
      const cell = viewer.next();
      cell.formula(`SUM(${c}${t1}:${c}${t2})`);
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  }
  {
    const { viewer, ws } = crea(items3, '未支付订单');
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  }
  return new Promise((resolve, reject) => {
    wb.write(file, (err, st) => {
      if(err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
};

// 店长月报
exports.storeMonthStat = (opt, date, file = `${os.tmpdir()}/xcache_${Date.now()}.xlsx`) => {
  const { one, two, three } = opt;
  const wb = new xl.Workbook();
  createOperationSheet(wb, one);
  createskuData(wb, two, date);
  createSKUstat(wb, three);
  return new Promise((resolve, reject) => {
    wb.write(file, (err, st) => {
      if(err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
};

const dailyOrderStatSheet = (ws, date, rs) => {
  const tdate = moment(date).format('MM月DD日');
  const ydate = moment(date).subtract(1, 'days').format('MM月DD日');
  const mdate = moment(date).month();
  const viewer = sheetViewer(ws, { left: 0, top: 0 });
  const head = ['序号', '房间数', '酒店', '运营类型', '开店时间', `${ydate}订单金额`, `${tdate}订单金额`, `${mdate + 1}月合计金额`];
  for(const h of head) {
    viewer.next().string(h);
  }
  let cc = 1;
  for(const item of Object.values(rs)) {
    viewer.enter();
    viewer.next().number(cc);
    viewer.next().number(item.position);
    viewer.next().string(item.t);
    viewer.next().string(item.optype);
    viewer.next().string(moment(item.at).format('YYYY-MM-DD'));
    viewer.next().number(item.yesterday / 100);
    viewer.next().number(item.today / 100);
    viewer.next().number(item.month / 100);
    cc += 1;
  }

  viewer.enter();
  viewer.next().string('合计');
  viewer.next(4);
  const { left, top, height } = viewer.meta();
  const t1 = top + 2;
  const t2 = top + height - 1;
  {
    const c = getE(left + 5);
    const cell = viewer.next();
    cell.formula(`SUM(${c}${t1}:${c}${t2})`);
  }
  {
    const c = getE(left + 6);
    const cell = viewer.next();
    cell.formula(`SUM(${c}${t1}:${c}${t2})`);
  }
  {
    const c = getE(left + 7);
    const cell = viewer.next();
    cell.formula(`SUM(${c}${t1}:${c}${t2})`);
  }

  viewer.columns(5, 8, 40, 20, 12, 16, 16, 14);
  return viewer.meta();
};

exports.dailyOrderStat = (date, rs, flag, file = `${os.tmpdir()}/xcache_${Date.now()}.xlsx`) => render(`${date} 销售日报`, file, (wb, ws) => {
  const meta = dailyOrderStatSheet(ws, date, rs);
  setBorder(wb, ws, meta);
  // start conditional rule
  const flagStyle = wb.createStyle({
    font: {
      bold: true,
    },
    fill: {
      type: 'pattern',
      bgColor: 'FFFF99'
    },
  });
  const getRule = () => {
    const rule = {
      type: 'cellIs',
      priority: 1,
      operator: 'greaterThan',
      formula: flag,
      style: flagStyle,
    };
    return rule;
  };
  const c1 = getE(meta.left + 5);
  const c2 = getE(meta.left + 6);
  ws.addConditionalFormattingRule(`${c1}${meta.top + 2}:${c1}${meta.top + meta.height - 1}`, getRule());
  ws.addConditionalFormattingRule(`${c2}${meta.top + 2}:${c2}${meta.top + meta.height - 1}`, getRule());
});

exports.monthOrderStat = (date, items, file = `${os.tmpdir()}/xcache_${Date.now()}.xlsx`) => render(`${date} 运营月报`, file, (wb, ws) => {
  const meta = monthOrderStatSheet(ws, items);
  setBorder(wb, ws, meta);
});
exports.invoicesSupplyExcel = (date, item, file = `${os.tmpdir()}/xcache_${Date.now()}.xlsx`) => render(`${date}`, file, (wb, ws) => {
  const meta = invoicesSupplySheet(ws, item, wb);
  setBorder(wb, ws, meta);
});

exports.finance = (data) => {
  const { goods, orders } = data;
  const goodSheet = (wb) => {
    const ws = wb.addWorksheet('结算商品明细');
    // layout
    const viewer = sheetViewer(ws, { left: 1, top: 1 });

    // header
    const head = ['支付方式', '支付编号', '订单创建时间', '订单支付时间', '公司', '门店',
      '商品运营类型', '商品编号', '分账类型', '商品名', '一级分类编码', ' 二级分类编码', '商品编码', '单价', '数量', '订单金额', '应付金额', '实付金额', '优惠金额', '手续费'];
    for(const h of head) {
      viewer.next().string(h);
    }
    for(const item of goods) {
      viewer.enter();
      viewer.next().string(item.payment || '');
      viewer.next().string(item.transaction || '');
      viewer.next().string(moment(item.order_date).format('YYYY-MM-DD HH:mm:ss'));
      viewer.next().string(moment(item.payment_at).format('YYYY-MM-DD HH:mm:ss'));
      viewer.next().string(item.company || '');
      viewer.next().string(item.store_t || '');
      // viewer.next().string(''); // company
      // viewer.next().string(item.city || ''); // city
      viewer.next().string(item.good_type_ops || ''); // good.ops
      viewer.next().string(item.good_id || '');
      viewer.next().string(item.tname || '');
      viewer.next().string(item.good_t || '');
      viewer.next().string(item.good_yjCategoryIndexCode || '');
      viewer.next().string(item.good_yjCategoryCode || '');
      viewer.next().string(item.good_yjCode || '');
      viewer.next().number(nn(item.good_p)).style({ ...curStyle });
      viewer.next().number(item.amount);
      viewer.next().number(nn(item.price)).style({ ...curStyle });
      if(item.real_price < 0) {
        viewer.next().number(0);
      } else {
        viewer.next().number(nn(item.price)).style({ ...curStyle });
      }
      viewer.next().number(nn(item.real_price || 0)).style({ ...curStyle });
      viewer.next().number(nn(item.price - item.real_price)).style({ ...curStyle }); // boon
      viewer.next().number(nn(item.real_price * 0.006)).style({ ...curStyle }); // fee
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };
  const orderSheet = (wb) => {
    const ws = wb.addWorksheet('订单列表');
    // layout
    const viewer = sheetViewer(ws, { left: 1, top: 1 });
    // header
    const head = ['订单编号', '门店', '位置', '实付金额', '状态', '订单项'];
    for(const h of head) {
      viewer.next().string(h);
    }

    for(const item of orders) {
      viewer.enter();
      viewer.next().string(item.order_no || '');
      viewer.next().string(item.store_t || '');
      viewer.next().string(item.position || ''); // good.ops
      viewer.next().number(nn(item.real_price || 0));
      viewer.next().string(item._status || '');
      viewer.next().string(item.t || '');
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };
  const wb = new xl.Workbook();
  goodSheet(wb);
  orderSheet(wb);
  return wb;
};

const FONT_HEAD = {
  bold: true,
  // charset: integer,
  color: 'black',
  name: '宋体',
  size: 18,
  // underline: boolean,
};

const FONT_META_UP = {
  bold: true,
  color: 'black',
  name: '宋体',
  size: 10,
};

const FONT_TABLE_HEAD = {
  bold: true,
  color: 'black',
  name: '华文宋体',
  size: 10,
};

const FONT_TABLE_CONTENT = {
  bold: false,
  color: 'black',
  name: '宋体',
  size: 10,
};

const centering = {
  horizontal: 'center',
  vertical: 'center',
};
exports.settles = (data, ext) => {
  const { goods, items, getExpress } = data;
  const rqs = [];
  const headSheet = '分账';

  const settlePage = (wb) => {
    const ws = wb.addWorksheet(headSheet);
    // layout
    const viewer = sheetViewer(ws, { left: 1, top: 1 });

    const head = ['酒店名称', '公司名称', '结算分类', '订单金额', '实付金额', '商品数量', '分成比例', '付款金额', '合计'];
    for(const h of head) {
      viewer.next().string(h);
    }
    for(const item of items) {
      const { t, list, store, company, tags, account } = item;
      const c = list.length;
      const imdata = (mda) => {
        const m = getExpress(store, mda.type);
        const ll = { ...m, ...mda };
        viewer.next().string(ll.tname || '');
        const v1 = cellIndex(viewer.next().number(nn(ll.price)).style({ ...curStyle }));
        const v2 = cellIndex(viewer.next().number(nn(ll.real)).style({ ...curStyle }));
        const v3 = cellIndex(viewer.next().number(ll.size));
        viewer.next().string(ll.ename || '');
        // const md = [v1, v2, v3];
        const express = ll.expression;
        if(express){
          const formula = express
            .replace(/\$\{1\}/g, v1)
            .replace(/\$\{2\}/g, v2)
            .replace(/\$\{3\}/g, v3);
          viewer.next().formula(formula).style({ ...curStyle });
        } else {
          viewer.next().number(0).style({ ...curStyle });
        }
      };
      let headdata = true;
      for(const ll of list) {
        // console.log(ll);
        viewer.enter();
        if(headdata) {
          const mid = { alignment: { horizontal: 'center', vertical: 'center' } };
          const headCell = viewer.merge(1, 1, 1 + c - 1, 1, true).string(t).style({ ...mid });
          viewer.merge(1, 1, 1 + c - 1, 1, true).string(company).style({ ...mid });
          imdata(ll);
          const concat = viewer.merge(1, 1, 1 + c - 1, 1, true);
          const { firstRow, firstCol } = concat;
          rqs.push({ account, tags, t: `${headSheet}!${getE(headCell.firstCol - 1)}${headCell.firstRow}`, val: `${headSheet}!${getE(firstCol - 1)}${firstRow}` });
          // console.log(`${headSheet}!${getE(headCell.firstCol - 1)}${headCell.firstRow}`);
          // console.log(`${getE(firstCol - 1)}${firstRow}`);
          const ite = [];
          for(let i = 0; i < c; i += 1) {
            ite.push(`${getE(firstCol - 2)}${firstRow + i}`);
          }
          concat.formula(ite.join('+')).style({ ...curStyle });
          headdata = false;
        } else {
          viewer.skip(2);
          imdata(ll);
          viewer.skip();
        }
      }
    }
    viewer.columns(30, 30, 17, 9, 9, 9, 20, 9, 9);
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };

  const goodSheet = (wb) => {
    const ws = wb.addWorksheet('商品明细');
    // layout
    const viewer = sheetViewer(ws, { left: 1, top: 1 });

    // header
    const head = ['支付凭证', '支付时间', '商品名', '一级分类编码', ' 二级分类编码', '商品编码', '酒店公司名', '门店', '分账类型', '商品类型', '单价', '数量', '订单金额', '实付金额', '状态', '分成'];
    for(const h of head) {
      viewer.next().string(h);
    }
    const first = viewer.meta().top + 2;

    let hasData = false;
    for(const v of Object.values(goods)) {
      for(const item of v) {
        // console.log(item);
        hasData = true;
        const { tname, expression, ename } = getExpress(item.store_id, item.good_type_settle);
        viewer.enter();
        viewer.next().string(item.transaction || '');
        viewer.next().string(moment(item.payment_at).format('YYYY-MM-DD HH:mm:ss'));
        viewer.next().string(item.good_t || '');
        viewer.next().string(item.good_yjCategoryIndexCode || '');
        viewer.next().string(item.good_yjCategoryCode || '');
        viewer.next().string(item.good_yjCode || '');
        viewer.next().string(item.company || '');
        viewer.next().string(item.store_t || '');
        viewer.next().string(tname || ''); // good.ops
        viewer.next().string(item.good_type_category || '');
        viewer.next().number(nn(item.good_p)).style({ ...curStyle });
        const v3 = cellIndex(viewer.next().number(item.amount));
        const v1 = cellIndex(viewer.next().number(nn(item.price)).style({ ...curStyle }));
        const v2 = cellIndex(viewer.next().number(nn(item.real_price)).style({ ...curStyle }));
        viewer.next().string(item.status === 'pay' ? '支付' : '退款');
        if(expression && expression.length < 11) {
          const formula = expression
            .replace(/\$\{1\}/g, v1)
            .replace(/\$\{2\}/g, v2)
            .replace(/\$\{3\}/g, v3);
          viewer.next().formula(formula).style({ ...curStyle });
        } else {
          viewer.next().number(0).style({ ...curStyle });
        }
      }
    }
    if(hasData) {
      viewer.enter();
      viewer.next().string('合计');
      viewer.skip(10);
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
      viewer.skip();
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
      // {
      //   const c = viewer.next();
      //   const ci = cellCIndex(c);
      //   const fat = getE(ci.col - 1);
      //   const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
      //   c.formula(fom);
      // }
      // viewer.skip();
      // {
      //   const c = viewer.next();
      //   const ci = cellCIndex(c);
      //   const fat = getE(ci.col - 1);
      //   const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
      //   c.formula(fom);
      // }
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };

  const setUnderLine = (cell) => {
    cell.style({ border: { bottom: { style: 'thin', color: 'black' } } });
  };
  const rev = (items) => {
    const ws = wb.addWorksheet('申请付款表');
    const empty = wb.createStyle({
      fill: {
        type: 'pattern',
        patternType: 'solid',
        bgColor: 'white',
      },
    });
    let rowCor = 1;
    ws.cell(1, 1, 15 + items.length, 12).style(empty);
    rowCor = 5;
    // head
    ws.row(2).setHeight(40);
    ws.cell(2, 1, 2, 8, true).string('付 款 申 请 单').style({
      alignment: centering,
      font: FONT_HEAD
    });
    // meta head
    let metas = [
      { x: 3, y: 1, t: '公司名称:' },
      { x: 4, y: 1, t: '部    门:' },
      { x: 3, y: 5, t: '员工编号:' },
      { x: 4, y: 5, t: '员工姓名:' },
      { x: 3, y: 7, t: '日期:' },
      { x: 4, y: 7, t: '附件张数' },
    ];
    for(const m of metas) {
      ws.cell(m.x, m.y).string(m.t);
    }
    ws.cell(3, 1, 4, 7).style({
      alignment: centering,
      font: FONT_META_UP
    });
    ws.cell(3, 8).formula('NOW()').style({ numberFormat: 'yyyy/mm/dd' });
    ws.row(3).setHeight(22);
    ws.row(4).setHeight(22);

    const viewer = sheetViewer(ws, { left: 0, top: rowCor - 1 });
    // header
    const head = ['序号', '门店名称', '门店标签', '付款金额', '付款单位名称', '开户行', '账号', '备注'];
    viewer.columns(8, 30, 11, 10, 20, 26, 16, 10);
    for(const h of head) {
      viewer.next().string(h);
    }
    viewer.enter();
    let count = 0;
    for(const item of items) {
      count += 1;
      viewer.next().number(count);
      viewer.next().formula(item.t);
      viewer.next().string(item.tags);
      viewer.next().formula(item.val).style({ ...curStyle });
      viewer.next().string(_.get(item, 'account.name') || '');
      viewer.next().string(_.get(item, 'account.bank') || '');
      viewer.next().string(_.get(item, 'account.account') || '');
      viewer.next().string(_.get(item, 'account.remark') || '');
      viewer.enter();
    }
    const meta = viewer.meta();
    viewer.next().string('合计');

    const fom = `SUM(${getE(meta.left + 3)}${meta.top + 2}:${getE(meta.left + 3)}${meta.top - 1 + meta.height})`;
    viewer.skip(2);
    const tval = viewer.next().formula(fom).style({ ...curStyle });
    setBorder(wb, ws, meta);
    ws.cell(rowCor, 1, rowCor, 8).style({
      alignment: centering,
      font: FONT_TABLE_HEAD
    });

    ws.cell(meta.top + 2, meta.left + 1, meta.top + 2 + meta.height, meta.left + 8).style({
      // alignment: centering,
      font: FONT_TABLE_CONTENT
    });
    rowCor += (2 + items.length);


    metas = [
      { x: rowCor,     y: 1, t: '减 : 预支' },
      { x: rowCor + 1, y: 1, t: '应退还公司' },
      { x: rowCor + 2, y: 1, t: '公司应补付' },

      { x: rowCor,     y: 5, t: 'Prepared by申请人:' },
      { x: rowCor + 1, y: 5, t: 'Approved by 批准人：' },
      { x: rowCor + 2, y: 5, t: 'CEO/总经理：' },
      { x: rowCor + 3, y: 5, t: 'Finance Dept 财务部：' },

      { x: rowCor,     y: 7, t: 'Date 日期：' },
      { x: rowCor + 1, y: 7, t: 'Date 日期：' },
      { x: rowCor + 2, y: 7, t: 'Date 日期：' },
      { x: rowCor + 3, y: 7, t: 'Date 日期：' },
    ];

    for(const m of metas) {
      ws.cell(m.x, m.y).string(m.t).style({
        alignment: centering,
        font: FONT_META_UP
      });
    }
    setUnderLine(ws.cell(rowCor, 6, rowCor + 3, 6));
    setUnderLine(ws.cell(rowCor, 8, rowCor + 3, 8));
    ws.row(rowCor).setHeight(22);
    ws.row(rowCor + 1).setHeight(22);
    ws.row(rowCor + 2).setHeight(22);
    ws.row(rowCor + 3).setHeight(22);
    ws.cell(rowCor, 2).number(0);
    const tcel = `${getE(tval.firstCol - 1)}${tval.firstRow}`;
    const dec = `${getE(1)}${rowCor}`;
    ws.cell(rowCor + 1, 2).formula(`IF(${dec}>${tcel},${dec}-${tcel},0)`);
    ws.cell(rowCor + 2, 2).formula(`IF(${tcel}>${dec},${tcel}-${dec},0)`);
  };
  const wb = new xl.Workbook();
  settlePage(wb);
  goodSheet(wb);
  if(ext) rev(rqs);
  return wb;
};

// 商户导出分账表
exports.reqSettle = (data) => {
  const { list, items, t, store, tags, company, account, getExpress } = data;
  // console.log(account);
  const headSheet = '分账';
  const rqs = [];
  const cover = wb => {
    
  };
  const goodSheet = (wb) => {
    const ws = wb.addWorksheet('商品明细');
    // layout
    const viewer = sheetViewer(ws, { left: 0, top: 0 });

    // header
    const head = ['支付凭证', '支付时间', '商品名', '一级分类编码', ' 二级分类编码', '商品编码', '分账类型', '商品类型', '单价', '数量', '订单金额', '实付金额', '状态', '分成'];
    for(const h of head) {
      viewer.next().string(h);
    }
    const first = viewer.meta().top + 2;

    let hasData = false;

    for(const item of items) {
      hasData = true;
      const { tname, expression, ename } = getExpress(item.store_id, item.good_type_settle);
      viewer.enter();
      viewer.next().string(item.transaction || '');
      viewer.next().string(moment(item.payment_at).format('YYYY-MM-DD HH:mm:ss'));
      viewer.next().string(item.good_t || '');
      viewer.next().string(item.good_yjCategoryIndexCode || '');
      viewer.next().string(item.good_yjCategoryCode || '');
      viewer.next().string(item.good_yjCode || '');
      viewer.next().string(tname || ''); // good.ops
      viewer.next().string(item.good_type_category || '');
      viewer.next().number(nn(item.good_p)).style({ ...curStyle });
      const v3 = cellIndex(viewer.next().number(item.amount));
      const v1 = cellIndex(viewer.next().number(nn(item.price)).style({ ...curStyle }));
      const v2 = cellIndex(viewer.next().number(nn(item.real_price)).style({ ...curStyle }));
      viewer.next().string(item.status === 'pay' ? '支付' : '退款');
      if(expression && expression.length < 11) {
        const formula = expression
          .replace(/\$\{1\}/g, v1)
          .replace(/\$\{2\}/g, v2)
          .replace(/\$\{3\}/g, v3);
        viewer.next().formula(formula).style({ ...curStyle });
      } else {
        viewer.next().number(0).style({ ...curStyle });
      }
    }
    if(hasData) {
      viewer.enter();
      viewer.next().string('合计');
      viewer.skip(10);
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
      viewer.skip();
      {
        const c = viewer.next();
        const ci = cellCIndex(c);
        const fat = getE(ci.col - 1);
        const fom = `SUM(${fat}${first}:${fat}${ci.row - 1})`;
        c.formula(fom);
      }
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };
  const settlePage = (wb) => {
    const ws = wb.addWorksheet(headSheet);
    // layout
    const viewer = sheetViewer(ws, { left: 1, top: 1 });

    const head = ['酒店名称', '公司名称', '结算分类', '订单金额', '实付金额', '商品数量', '分成比例', '付款金额', '合计'];
    for(const h of head) {
      viewer.next().string(h);
    }

    // const { t, list, store, company, tags, account } = item;
    const c = list.length;
    const imdata = (mda) => {
      const m = getExpress(store, mda.type);
      const ll = { ...m, ...mda };
      viewer.next().string(ll.tname || '');
      const v1 = cellIndex(viewer.next().number(nn(ll.price)).style({ ...curStyle }));
      const v2 = cellIndex(viewer.next().number(nn(ll.real)).style({ ...curStyle }));
      const v3 = cellIndex(viewer.next().number(ll.size));
      viewer.next().string(ll.ename || '');
      // const md = [v1, v2, v3];
      const express = ll.expression;
      if(express){
        const formula = express
          .replace(/\$\{1\}/g, v1)
          .replace(/\$\{2\}/g, v2)
          .replace(/\$\{3\}/g, v3);
        viewer.next().formula(formula).style({ ...curStyle });
      } else {
        viewer.next().number(0).style({ ...curStyle });
      }
    };
    let headdata = true;
    for(const ll of list) {
      // console.log(ll);
      viewer.enter();
      if(headdata) {
        const mid = { alignment: { horizontal: 'center', vertical: 'center' } };
        const headCell = viewer.merge(1, 1, 1 + c - 1, 1, true).string(t).style({ ...mid });
        viewer.merge(1, 1, 1 + c - 1, 1, true).string(company).style({ ...mid });
        imdata(ll);
        const concat = viewer.merge(1, 1, 1 + c - 1, 1, true);
        const { firstRow, firstCol } = concat;
        rqs.push({ account, tags, t: `${headSheet}!${getE(headCell.firstCol - 1)}${headCell.firstRow}`, val: `${headSheet}!${getE(firstCol - 1)}${firstRow}` });
        // console.log(`${headSheet}!${getE(headCell.firstCol - 1)}${headCell.firstRow}`);
        // console.log(`${getE(firstCol - 1)}${firstRow}`);
        const ite = [];
        for(let i = 0; i < c; i += 1) {
          ite.push(`${getE(firstCol - 2)}${firstRow + i}`);
        }
        concat.formula(ite.join('+')).style({ ...curStyle });
        headdata = false;
      } else {
        viewer.skip(2);
        imdata(ll);
        viewer.skip();
      }
    }
    viewer.columns(30, 30, 17, 9, 9, 9, 20, 9, 9);
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };
  const wb = new xl.Workbook();
  settlePage(wb);
  goodSheet(wb);
  return wb;
};

exports.points = (data) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('点位统计');
  // layout
  const viewer = sheetViewer(ws, { left: 1, top: 1 });
  // header
  const head = ['店铺', '点位', '订单数', '订单金额'];
  for(const h of head) {
    viewer.next().string(h);
  }

  for(const item of data) {
    viewer.enter();
    viewer.next().string(item.store_t || '');
    viewer.next().string(item.d || item.t || '');
    viewer.next().number(item.count || 0); // good.ops
    viewer.next().number(nn(item.total || 0));
  }
  const meta = viewer.meta();
  setBorder(wb, ws, meta);
  return wb;
};

exports.checkout = (data) => {
  const { items, acc } = data;
};

exports.dups = (data) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('24复购');
  // layout
  const viewer = sheetViewer(ws, { left: 0, top: 0 });
  // header
  const head = ['昵称', '订单数', '订单金额', '消费门店数', '24h复购订单数', '24h复购订单金额'];
  for(const h of head) {
    viewer.next().string(h);
  }
  for(const item of data) {
    viewer.enter();
    viewer.next().string(item.nickname || '');
    viewer.next().number(item.count || 0);
    viewer.next().number(nn(item.total || 0));
    viewer.next().number(item.scount || 0);
    viewer.next().number(item.dupcount || 0);
    viewer.next().number(nn(item.dupprice || 0));
  }
  const meta = viewer.meta();
  setBorder(wb, ws, meta);
  return wb;
};
// 月报
exports.monthNeo = (opt) => {
  const { data, dates, bis } = opt;
  const wb = new xl.Workbook();
  const main = () => {
    const ws = wb.addWorksheet('运营数据');
    const viewer = sheetViewer(ws, { left: 0, top: 0 });
    const head = ['日期', '订单金额', '实收金额', '订单数', '有效订单数', '新建用户', '下单用户', '复购用户', '平局客单价'];
    for(const h of head) {
      viewer.next().string(h);
    }
    for(const d of bis) {
      viewer.enter();
      viewer.next().string(d.date || '');
      viewer.next().number(nn(d.commodityPrice) || 0);
      viewer.next().number(nn(d.receivedPrice) || 0);
      viewer.next().number(d.totalAmount || 0);
      viewer.next().number(d.validAmount || 0);
      viewer.next().number(d.newUsers || 0);
      viewer.next().number(d.orderUsers || 0);
      viewer.next().number(d.reOrderUsers || 0);
      viewer.next().number(nn(d.receivedPrice/d.validAmount) || 0);
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };
  main();
  const maps = {};
  const skuData = () => {
    const ws = wb.addWorksheet('SKU数据');
    // layout
    const viewer = sheetViewer(ws, { left: 0, top: 0 });
    // header
    const head = ['商品名', '单价', '成本', '分类', '总数', '有效总数'];
    head.push(...dates);
    for(const h of head) {
      viewer.next().string(h);
    }
    
    for(const item of data) {
      const category = item.category || '无';
      const { amount, amount_d } = item;
      const total = amount - amount_d;
      const amount_price = item.price * amount;
      const total_price = item.price * total;
      const amount_cost = item.cost * amount;
      const total_cost = item.cost * total;
      viewer.enter();
      viewer.next().string(item.t || '');
      viewer.next().number(nn(item.price || 0) || 0);
      viewer.next().number(nn(item.cost || 0) || 0);
      viewer.next().string(category);
      viewer.next().number(total || 0);
      viewer.next().number(item.amount || 0);
      const tmap = item.tmap || {};
      for(const date of dates) {
        const dt = tmap[date] || { amount: 0 };
        viewer.next().number(dt.amount || 0);
      }
      maps[category] = maps[category] || { amount: 0, total: 0, amount_price: 0, total_price: 0, amount_cost: 0, total_cost: 0 };
      const ite = maps[category];
      ite.amount += amount;
      ite.total += total;
      ite.amount_price += amount_price;
      ite.total_price += total_price;
      ite.amount_cost += amount_cost;
      ite.total_cost += total_cost;
    }
  };
  skuData();
  const skuStat = () => {
    const ws = wb.addWorksheet('SKU分析');
    // layout
    const viewer = sheetViewer(ws, { left: 0, top: 0 });
  
    const head = ['商品分类', '总数', '有效总数', '总价', '有效总价', '总成本', '有效总成本'];
    for(const h of head) {
      viewer.next().string(h);
    }
    for(const k in maps) {
      const d = maps[k];
      viewer.enter();
      viewer.next().string(k);
      viewer.next().number(d.total || 0);
      viewer.next().number(d.amount || 0);
      viewer.next().number(nn(d.total_price) || 0);
      viewer.next().number(nn(d.amount_price) || 0);
      viewer.next().number(nn(d.total_cost) || 0);
      viewer.next().number(nn(d.amount_cost) || 0);
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };
  skuStat();
  return wb;
};

// 对账结果
exports.diff = (data) => {
  const cpage = (wb, d) => {
    const { name, items } = d;
    const ws = wb.addWorksheet(name);
    const viewer = sheetViewer(ws, { left: 0, top: 0 });
    if(items && items.length) {
      const head = ['微信支付单号', '流水号', '状态', '金额', '业务凭证'];
      for(const h of head) {
        viewer.next().string(h);
      }
      for(const item of items) {
        viewer.enter();
        viewer.next().string(item.no || '');
        viewer.next().string(item.transaction || '');
        viewer.next().string(item.status === 'pay' ? '支付' : '退款');
        viewer.next().number(nn(item.real));
        viewer.next().string(item.order || '');
      }
      const meta = viewer.meta();
      setBorder(wb, ws, meta);
    } else {
      viewer.next().string('无');
    }
  };
  const dpage = (wb, diffs) => {
    const ws = wb.addWorksheet('差异');
    const viewer = sheetViewer(ws, { left: 0, top: 0 });
    const head = ['微信支付单号', '流水号', '状态', 'ACMS', '支付系统'];
    for(const h of head) {
      viewer.next().string(h);
    }
    for(const item of diffs) {
      viewer.enter();
      viewer.next().string(item.no || '');
      viewer.next().string(item.transaction || '');
      viewer.next().string(item.status === 'pay' ? '支付' : '退款');
      viewer.next().number(nn(item.acms));
      viewer.next().number(nn(item.out));
    }
    const meta = viewer.meta();
    setBorder(wb, ws, meta);
  };
  const { acms, out, diffs } = data;
  const wb = new xl.Workbook();
  cpage(wb, acms);
  cpage(wb, out);
  dpage(wb, diffs);
  return wb;
};

exports.exprTest = (data) => {
  const settlePage = (wb) => {
    const ws = wb.addWorksheet('公式测试');
    const viewer = sheetViewer(ws, { left: 1, top: 1 });
    const head = ['公式名', '订单价/$1', '实付价/$2', '商品数/$3', '结果'];
    for(const h of head) {
      viewer.next().string(h);
    }
    for(const item of data) {
      const { t, expression } = item;
      viewer.enter();
      viewer.next().string(t || '');
      const v1 = cellIndex(viewer.next().number(1000));
      const v2 = cellIndex(viewer.next().number(800));
      const v3 = cellIndex(viewer.next().number(21));
      const md = [v1, v2, v3];
      if(expression) {
        const formula = expression
          .replace(/\$\{1\}/g, v1)
          .replace(/\$\{2\}/g, v2)
          .replace(/\$\{3\}/g, v3);
        viewer.next().formula(formula);
      }
    }
    viewer.columns(25, 20, 10, 10, 10);
  };
  const wb = new xl.Workbook();
  settlePage(wb);
  return wb;
};

exports.toStream = (wb, type = 'stream') => {
  logger.info('trace', 'wrap file as ', type);
  switch(type) {
    case 'stream':
      // const file = `${os.tmpdir()}/xcache_${Date.now()}.xlsx`;
      // const writeStream = fs.createWriteStream(file);
      // console.time('createFile');
      // const promise = new Promise((resolve, reject) => {
      //   wb.readstream().then((readStream) => {
      //     readStream.pipe(writeStream).on('close', resolve).on('error', reject);
      //   });
      // });
      // const clear = () => {
      //   if(fs.existsSync(file)) {
      //     logger.info('clear cache file', file);
      //     fs.unlinkSync(file);
      //   }
      // };
      // return promise.then(() => {
      //   console.timeEnd('createFile');
      //   console.log('create stream');
      //   return fs.createReadStream(file).on('close', clear).on('error', clear).on('end', clear);
      // });
      return wb.readstream();
    case 'file': {
      const file = `${os.tmpdir()}/xcache_${Date.now()}.xlsx`;
      const clear = () => {
        if(fs.existsSync(file)) {
          logger.info('trace', 'clear cache file', file);
          fs.unlinkSync(file);
        }
      };
      return new Promise((resolve, reject) => {
        wb.write(file, (err, st) => {
          if(err) {
            reject(err);
          } else {
            const stream = fs.createReadStream(file);
            stream.on('close', clear).on('error', clear).on('end', clear);
            resolve(stream);
          }
        });
      });
    }
    default:
      return wb.writeToBuffer();
  }
};
exports.pipeToStream = (file, ctx, del = true) => {
  logger.info('trace', 'pipetofile', file);
  const clear = () => {
    if(del && fs.existsSync(file)) {
      logger.info('trace', 'clear cache file', file);
      fs.unlinkSync(file);
    }
  };
  ctx.body = fs.createReadStream(file);
  ctx.body.on('close', clear).on('error', clear).on('end', clear);
};

exports.setDownload = (ctx, subfix = 'xls', filename) => {
  const type = mime.getType(subfix);
  const userAgent = (ctx.req.headers['user-agent'] || '').toLowerCase();
  ctx.set('Content-Type', type);
  ctx.set('filename', encodeURI(filename));
  if(userAgent.indexOf('firefox') >= 0) {
    const ext = Buffer.from(filename, 'utf-8').toString('binary');
    ctx.set('Content-Disposition', `attachment; filename*="utf8''${ext}"`);
  } else {
    ctx.set('Content-Disposition', `attachment; filename=${encodeURI(filename)}`);
  }
};


exports.readFile = parse;

exports.XLSXReader = (tab, { valid }) => {
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

