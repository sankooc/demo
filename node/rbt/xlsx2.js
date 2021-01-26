// const XLSX = require('xlsx');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

// const workbook = XLSX.readFile(__dirname + '/fin.xlsx');


// const sheet = workbook.Sheets['结算单'];
// console.log(workbook);

// const wb = XLSX.utils.book_new();
// // const meta = _.omit(workbook, 'Workbook', 'Sheets', 'SheetNames');
// // wb.Styles = workbook.Styles;
// // wb.Styles = workbook.Props;
// // Object.assign(wb, meta);
// const new_ws = JSON.parse(JSON.stringify(workbook));
// XLSX.utils.book_append_sheet(wb, new_ws, 'test');
// XLSX.writeFileSync(wb, target);
// const ws = XLSX.utils.aoa_to_sheet(sheet);
// http://aiui.yunjiai.cn/back


const Excel = require('exceljs');

const { exec } = require('child_process');

(async () => {
  const data = {
    store: '中关村机器人',
    from: new Date('2019-08-03T03:44:41.062Z'),
    to: new Date('2019-09-03T03:44:41.062Z'),
    items: [
      {
        orderId: '5ce42c190ccab15231ed9009',
        goods: [
          {
            id: '5cc39e20f3bdb7098544c379',
            name: '维他柠檬茶',
            price: 12.43,
            count: 1,
            real: 10.21,
            pct: 0.6,
          },
          {
            id: '5cc39e20f3bdb7098554c379',
            name: '可乐',
            price: 3.3,
            count: 3,
            real: 10.21,
            pct: 0.9,
          },
          {
            id: '5cc39e20f3bdb7098554c370',
            name: '水水水',
            price: 10,
            count: 1,
            real: 8,
            pct: 0.1,
          },
        ],
      }
    ],
  };
  const target = `${__dirname}/test.xlsx`;
  if(fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
  
  {
    const workbook2 = new Excel.Workbook();
    const sheet2 = workbook2.addWorksheet('test');
    const ctx = {
      row: 1,
      col: 65,
    };
    const cellFont = {
      size: 11,
      name: '等线',
    };
    const cellAlign = { vertical: 'middle', horizontal: 'center' };
    const setCell = (cell) => {
      cell.font = cellFont;
      cell.alignment = cellAlign;
    };
    const boldFont = (cell) => {
      cell.style.font = cell.style.font || cellFont;
      cell.style.font.bold = true;
    };
    const wids = [30, 30, 20, 14, 14, 14, 14, 14, 14, 14, 14];
    for(let inx = 1; inx <= wids.length; inx += 1) {
      sheet2.getColumn(ctx.col + inx - 65).width = wids[inx - 1];
    }
    const title = '服务生商品结算单';
    const date = moment().format('YYYY-MM-DD');
    {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + 4)}${ctx.row}`);
      c.value = title;
      c.style = {
        fill: { type: 'pattern', pattern: 'none' },
        alignment: { horizontal: 'center', vertical: 'middle' },
        font: {
          size: 18,
          bold: true,
          name: '等线',
        }
      };
    }

    const field = (offset, value) => {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + offset)}${ctx.row}`);
      c.value = value;
      boldFont(c);
      c.alignment = { vertical: 'middle', horizontal: 'left' };
    };
    const val = (offset, value) => {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + offset)}${ctx.row}`);
      c.value = value;
      c.alignment = { vertical: 'middle', horizontal: 'center' };
    };

    ctx.row += 2;
    field(0, '客户名称:');
    val(1, data.store);
    field(4, '日期:');
    val(5, date);
    ctx.row += 1;
    field(4, '单位:');
    val(5, '元');
    field(7, '日结:');
    val(8, moment(data.from).format('YYYY年MM月DD日'));
    val(9, moment(data.to).format('YYYY年MM月DD日'));
    ctx.row += 1;
    const headers = ['订单编号', '商品编号', '商品名称', '数量', '单价', '应付金额', '综合优惠', '实付金额', '手续费', '分成比例', '分成金额'];
    
    for(let i = 0; i < 11; i += 1) {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + i)}${ctx.row}`);
      c.value = headers[i];
      c.font = {
        name: '等线',
        size: 12,
        bold: true
      };

      c.alignment = { vertical: 'middle', horizontal: 'center' };
      c.border = {
        right: { style:'thin' },
        bottom: { style:'thin' },
        top: { style:'medium' },
      };
      if(i === 0) {
        c.border.left = { style:'medium' };
      }
      if(i === 10) {
        c.border.right = { style:'medium' };
      }
    }
    ctx.row += 1;
   // ctx.row = 6;
    const hrow = ctx.row;
    for(const order of data.items) {
      const { orderId, goods } = order;
      const mnum = goods.length;
      const f = `${String.fromCharCode(ctx.col)}${ctx.row}`;
      const e = `${String.fromCharCode(ctx.col)}${ctx.row + mnum - 1}`;
      sheet2.mergeCells(`${f}:${e}`);
      const head = sheet2.getCell(f);
      head.value = orderId;
      head.font = cellFont;
      head.alignment = cellAlign;
      head.border = {
        top: { style:'thin' },
        left: { style:'medium' },
        right: { style:'thin' },
        bottom: { style:'thin' },
      };
      for(const good of goods) {
        let col = ctx.col;
        const row = ctx.row;
        const cell = () => {
          col += 1;
          const f = `${String.fromCharCode(col)}${row}`;
          const c = sheet2.getCell(f);
          c.font = {
            size: 11,
            name: '等线',
          };
          c.alignment = { vertical: 'middle', horizontal: 'center' };
          c.border = {
            right: { style:'thin' },
            bottom: { style:'thin' },
          };
          return c;
        };
        const { id, name, price, count, real, pct } = good;
        cell().value = id;
        cell().value = name;
        cell().value = count;
        cell().value = price;
        cell().value = { formula: `${String.fromCharCode(ctx.col + 3)}${row}*${String.fromCharCode(ctx.col + 4)}${row}`, result: count * price };
        cell().value = { formula: `${String.fromCharCode(ctx.col + 5)}${row}*${String.fromCharCode(ctx.col + 7)}${row}`, result: count * price - real };
        cell().value = real;
        {
          const result = parseFloat((real * 0.006).toFixed(2));
          cell().value = { formula: `ROUND(${String.fromCharCode(ctx.col + 7)}${row}*0.6%, 2)`, result };
        }
        {
          const cc = cell();
          cc.value = pct;
          cc.numFmt = '0%';
        }
        {
          const cc = cell();
          const result = parseFloat((real * 0.994 * pct).toFixed(2));
          cc.value = { formula: `ROUND((${String.fromCharCode(ctx.col + 7)}${row}-${String.fromCharCode(ctx.col + 8)}${row})*${String.fromCharCode(74)}${row}, 2)`, result };
          cc.border.right = { style: 'medium' };
        }
        ctx.row += 1;
      }
    }
    for(let i = 0; i < 11; i += 1) {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + i)}${ctx.row}`);
      c.border = {
        right: { style:'thin' },
        bottom: { style:'thin' },
      };
      if(i === 0) {
        c.border.left = { style:'medium' };
      }
      if(i === 11) {
        c.border.right = { style:'medium' };
      }
    }
    {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col)}${ctx.row}`);
      setCell(c);
      c.value = '合计';
    }
    {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + 5)}${ctx.row}`);
      setCell(c);
      c.value = { formula: `SUM(${String.fromCharCode(ctx.col + 5)}${hrow}:${String.fromCharCode(ctx.col + 5)}${ctx.row - 1})`, result: '双击回车' };
    }
    {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + 7)}${ctx.row}`);
      setCell(c);
      c.value = { formula: `SUM(${String.fromCharCode(ctx.col + 7)}${hrow}:${String.fromCharCode(ctx.col + 7)}${ctx.row - 1})`, result: '双击回车' };
    }
    {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + 10)}${ctx.row}`);
      setCell(c);
      c.value = { formula: `SUM(${String.fromCharCode(ctx.col + 10)}${hrow}:${String.fromCharCode(ctx.col + 10)}${ctx.row - 1})`, result: '双击回车' };
      c.border.right = { style: 'medium' };
    }
    ctx.row += 1;

    {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col)}${ctx.row}`);
      setCell(c);
      c.border = {
        right: { style:'thin' },
        bottom: { style:'medium' },
        left: { style:'medium' },
      };
      c.value = '付款金额（大写）';
    }
    {
      const c = sheet2.getCell(`${String.fromCharCode(ctx.col + 1)}${ctx.row}`);
      c.border = {
        bottom: { style:'medium' },
        right: { style:'medium' },
      };
      setCell(c);
      const lt = `${String.fromCharCode(ctx.col + 10)}${ctx.row - 1}`;
      c.value = { formula: `SUBSTITUTE(SUBSTITUTE(TEXT(INT(${lt}),"[DBNum2][$-804]G/通用格式元"&IF(INT(${lt})=${lt},"整",""))&TEXT(MID(${lt},FIND(".",${lt}&".0")+1,1),"[DBNum2][$-804]G/通用格式角")&TEXT(MID(${lt},FIND(".",${lt}&".0")+2,1),"[DBNum2][$-804]G/通用格式分"),"零角","零"),"零分","")`, result: '双击回车' };
      sheet2.mergeCells(`${String.fromCharCode(ctx.col + 1)}${ctx.row}:${String.fromCharCode(ctx.col + 10)}${ctx.row}`);
    }
    ctx.row += 1;

    field(0, '制单人：');
    field(5, '审核人：');
    ctx.row += 1;
    field(0, '制单日期：');
    field(5, '审核日期：');
    await workbook2.xlsx.writeFile(target);
    exec(`open ${target}`, () => {});
  }
})();
