// const data = {
//   "scenicspotId": 1910683,
//   "scenicspotName": "光芒山",
//   "scenicspotCityId": 21474,
//   "scenicspotCityName": "勐海",
//   "scenicspotStar": 0, "scenicspotCommentGrade": 0,
//   "id": 16860118, "name": "光芒山+午餐门票成人票", "price": 84, "ctripPrice": 88, "marketPrice": 150,
//   "categoryId": 4, "firstBookingDate": "/Date(1560960000000+0800)/", "minQuantity": 1, "maxQuantity": 99,
//   "ticketType": 0, "payMode": "P", "advanceBookingDays": 0, "advanceBookingTime": "16:00", "peopleGroup": 1,
//   "unitQuantity": 1, "refundNewType": 1, "customerInfoTemplateID": 1, "modifyType": 0, "modifyTypeOtherRequirement": 0, "resourceAddInfoList": [{ "titleCode": "111", "title": "预订说明", "subTitleCode": "116", "subTitle": "预订时间", "resourceAddInfoDetailList": [{ "descDetail": "最晚需在【出行当天16:00】前购买" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "111", "title": "预订说明", "subTitleCode": "126", "subTitle": "有效期", "resourceAddInfoDetailList": [{ "descDetail": "选择的使用日期当天有效。" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "111", "title": "预订说明", "subTitleCode": "129", "subTitle": "出票速度", "resourceAddInfoDetailList": [{ "descDetail": "平均2秒出票" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "111", "title": "预订说明", "subTitleCode": "83", "subTitle": "适用条件", "resourceAddInfoDetailList": [{ "descDetail": "适用人群：1.2米以上（含1.2米）" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "112", "title": "费用说明", "subTitleCode": "15", "subTitle": "费用包含", "resourceAddInfoDetailList": [{ "descDetail": "光芒山大门票+午餐。" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "113", "title": "使用说明", "subTitleCode": "13", "subTitle": "使用方法", "resourceAddInfoDetailList": [{ "descDetail": "凭携程订单号取票入园" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "113", "title": "使用说明", "subTitleCode": "99", "subTitle": "取票时间", "resourceAddInfoDetailList": [{ "descDetail": "08:00~16:30" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "113", "title": "使用说明", "subTitleCode": "97", "subTitle": "取票地址", "resourceAddInfoDetailList": [{ "descDetail": "景区大门口" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "113", "title": "使用说明", "subTitleCode": "119", "subTitle": "入园处", "resourceAddInfoDetailList": [{ "descDetail": "入园地址、入园时间与取票地址、取票时间相同" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "113", "title": "使用说明", "subTitleCode": "121", "subTitle": "补充说明", "resourceAddInfoDetailList": [{ "descDetail": "凭商家确认短信取票入园,入园障碍联系人：18288009079" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "114", "title": "退改说明", "subTitleCode": "74", "subTitle": "退改规则", "resourceAddInfoDetailList": [{ "descDetail": "未使用可随时申请退款。" }, { "descDetail": "订单不支持部分退。" }, { "descDetail": "如需改期，请申请取消后重新预订。" }], "regOrder": false, "showAtReserve": false }, { "titleCode": "115", "title": "其他说明", "subTitleCode": "125", "subTitle": "其他须知", "resourceAddInfoDetailList": [{ "descDetail": "1、团队客人及包车客人不可使用该票种，敬请谅解。" }, { "descDetail": "2、游玩当天聘有当地导游的游客不可使用该票种。" }, { "descDetail": "3、游玩当天使用酒店/客栈接送的游客不可使用该票种。" }], "regOrder": false, "showAtReserve": false }], "displayTagGroupList": [], "canSaleYunji": true, "highRisk": false, "bookingLimit": false, "preferential": false, "saleAlone": false, "smssender": 0
// };

// const tmap = {
//   0: '联票',
//   2: '单票',
//   4: '套票'
// }
// const cmap = {
//   4: '景点门票',
//   36: '高尔夫球票',
//   38: '一日游',
//   40: '园内餐饮票',
//   41: '园内交通票',
//   42: '园内演出票',
//   43: '园内其他票',
//   44: '联票'
// };
// const gmap = {
//   1: '成人',
//   2: '儿童',
//   4: '学生',
//   8: '老人',
//   16: '其他',
//   32: '家庭',
// };
// const modifyMap = {
//   0: '不可改票出行日期', 1: '可改票出行日期',
// };
// const smsMap = { 0: '无凭证', 1: '供应商发凭证', 2: '携程发凭证', };
// const refundMap = {
//   1: '随时退', 2: '非随时退', 3: '不可退'
// };
// const ticket = (data) => {
//   const rs = {
//     name: data.canSaleYunji,
//     canSaleYunji: data.canSaleYunji,
//     price: {
//       mode: data.payMode,
//       base: data.price,
//       ctrip: data.ctripPrice,
//       market: data.marketPrice
//     },
//     quantity: {
//       min: data.minQuantity,
//       max: data.maxQuantity
//     },
//     type: tmap[data.ticketType],
//     group: gmap[data.peopleGroup],
//     tags: [
//       data.highRisk ? '高风险' : '无风险',
//       `提前${data.advanceBookingDays}天预定`,
//       `${data.advanceBookingTime}前可预定`,
//       cmap[data.categoryId],
//       refundMap[data.refundNewType],
//       modifyMap[data.modifyType],
//       smsMap[data.smssender],
//     ],
//     infoList: [],
//   };
//   const map = {};
//   for(const rr of data.resourceAddInfoList) {
//     if(!map[rr.title]) map[rr.title] = [];
//     map[rr.title].push({ key: rr.subTitle, value: rr.resourceAddInfoDetailList.map(r => r.descDetail).join('<p/>') });
//   }
//   rs.infoList = Object.keys(map).map(name => ({ name, val: map[name] }));
//   console.dir(rs.infoList)
//   return rs;
// };


// console.log('-- start --');
// console.dir(ticket(data));

// const cfg = {
//   appname: 'test',
//   secret: 'df556ef607b8b583baa5e8b6afc5a205',
//   prefix: 'http://api.yunjichina.com.cn/openapi/v1/robot'
// };
// const cservice = require('../libs/ctripService').craete(cfg);

// // const cservice2 = require('../libs/services/ctrip');


// const start = async () => {
//   await cservice.scenicspots({ start: 0, count: 10, filters: { canSaleYunji: true } });
//   // const cy = await cservice2.getCityList({});
//   // console.log(cy);
// };
// (start)();


/**

https://api-test.yunjichina.com.cn/openapi/v1/ctrip/scenicspot/query
[ { filters: { canSaleYunji: true } },
  { start: 0 },
  { count: 10 } ]

请求云平台参数 https://api-test.yunjichina.com.cn/openapi/v1/ctrip/scenicspot/query
请求云平台body { count: 10,
  filters: { canSaleYunji: true },
  start: 0,
  appname: 'test',
  ts: 1566822752820,
  sign: 'bdc3e29dd61c3c801cb7bd03a5cf1973' }

https://api-test.yunjichina.com.cn/openapi/v1/ctrip/scenicspot/query
[ { filters: { canSaleYunji: true } },
  { start: 0 },
  { count: 10 } ]
***
请求云平台参数 https://api-test.yunjichina.com.cn/openapi/v1/ctrip/scenicspot/query
请求云平台body { count: 10,
  filters: { canSaleYunji: true },
  start: 0,
  appname: 'test',
  ts: '1566822752820',
  sign: 'bdc3e29dd61c3c801cb7bd03a5cf1973' }

  { appname: 'test',
  start: 0,
  count: 10,
  filters: { canSaleYunji: true },
  ts: 1566822752820,
  sign: 'bdc3e29dd61c3c801cb7bd03a5cf1973' }

count:10|filters:{"canSaleYunji":true}|start:0|appname:test|secret:df556ef607b8b583baa5e8b6afc5a205|ts:1566822752820
count:10|filters:{"canSaleYunji":true}|start:0|appname:test|secret:df556ef607b8b583baa5e8b6afc5a205|ts:1566822752820


bdc3e29dd61c3c801cb7bd03a5cf1973
bdc3e29dd61c3c801cb7bd03a5cf1973

 */

const topo = (datas, swaper) => {
  const inSet = new Set();
  const map = {};
  const items = datas.map((d) => {
    const { parents, node } = swaper(d);
    map[node] = d;
    return { parents, node };
  });
  const exists = (item) => {
    const { parents, node } = item;
    if(!parents || !parents.length) {
      return true;
    }
    for(const p of parents) {
      if(!inSet.has(p)) {
        return false;
      }
    }
    return true;
  };
  while(items.length) {
    const size = inSet.size;
    for(let i = 0; i < items.length;) {
      const item = items[i];
      const { node } = item;
      if(exists(item)) {
        inSet.add(node);
        items.splice(i, 1);
      } else {
        i += 1;
      }
    }
    if(size === inSet.size) {
      const errMsg = `dep_error in ${items.map(it => it.node)}`;
      return { success: false, errMsg };
    }
  }
  return { success: true, sorts: [...inSet.values()].map(n => map[n]) };
};


// const rs = topo([{ node: '0', parents: [] }, { node: '1', parents: ['0'] }, { node: '2', parents: ['3'] }, { parents: ['1'], node: '3' }], (d) => d);
const rs = topo([]);
console.log(rs);
