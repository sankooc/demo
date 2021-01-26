// const Big = require('big.js');


// console.log(new Big(12.3).times(100).toFixed(0));



// const mime = require('mime');
// const type = mime.getType('xls');
// console.log(type);
// const fs = require('fs');
// const file = '/var/folders/h_/dldcwwls5q7gmgld5lhqhj2h0000gn/T/xcache_1573098726825.xlsx';
// fs.createReadStream(file);


// const EventEmitter = require('events');
// const eventTable = new EventEmitter();
// eventTable.on('test', () => { throw Error(); });
// console.log('start');
// eventTable.emit('test');


// console.log('finish');

// const vm = require('vm');

// function loop() {
//   while (1) console.log(Date.now());
// }

// vm.runInNewContext(
//   'Promise.resolve().then(loop);',
//   { loop, console },
//   { timeout: 5 }
// );


// const points = [{ x: 20, y: 40 }, { x: 100, y: 20 }, { x: 150, y: 50 }, { x: 200, y: 5 }];

// let start = { x: 10,    y: 20  };
// let cp1 =   { x: 50,   y: 80  };
// let cp2 =   { x: 120,   y: 30  };
// let end =   { x: 150,   y: 70 };
// let end2 =   { x: 200,   y: 120 };
const points = [{ x: 10, y: 20 }, { x: 50, y: 80 }, { x: 120, y: 30 }, { x: 150, y: 70 }, { x: 200, y: 120 }];

const mid = (p1, p2) => {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
};

const dis = (p1, p2) => Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));

const inc = (p, vector, head, radio = 0.5) => {
  let { x, y } = p;
  const { arc, div, len } = vector;
  if(head) {
    const ll = len * div * radio;
    x -= ll;
    y -= (ll * arc);
  } else {
    const ll = len * (1 - div) * radio;
    x += ll;
    y += (ll * arc);
  }
  return { x, y };
};

const as = [];
for(let i = 1; i < points.length; i += 1) {
  as.push(mid(points[i - 1], points[i]));
}
const vectors = [];
for(let i = 1; i < as.length; i += 1) {
  const arc = (as[i].y - as[i - 1].y) / (as[i].x - as[i - 1].x);
  const dp1 = dis(points[i - 1], points[i]);
  const dp2 = dis(points[i + 1], points[i]);
  const div = dp1 / (dp2 + dp1);
  const len = (as[i].x - as[i - 1].x);
  vectors.push({ arc, len, div });
}
const radio = 0.8;
const params = [];
for(let i = 0; i < points.length - 1; i += 1) {
  const c = points[i];
  const n = points[i + 1];
  if(i === 0) {
    const v = vectors[0];
    const h = inc(n, v, true, radio);
    params.push([c.x, c.y, h.x, h.y, h.x, h.y, n.x, n.y]);
  } else if(i === points.length - 2) {
    const v = vectors[i - 1];
    const h = inc(c, v, false, radio);
    params.push([c.x, c.y, h.x, h.y, h.x, h.y, n.x, n.y]);
  } else {
    const v1 = vectors[i - 1];
    const v2 = vectors[i];
    const h1 = inc(c, v1, false, radio);
    const h2 = inc(n, v2, true, radio);
    params.push([c.x, c.y, h1.x, h1.y, h2.x, h2.y, n.x, n.y]);
  }
}

console.log(as);
console.log(vectors);
console.log(params);


// {
// const canvas = document.getElementById('cvs');
// const ctx = canvas.getContext('2d');

// // Define the points as {x, y}
// // let start = { x: 10,    y: 20  };
// // let cp1 =   { x: 50,   y: 80  };
// // let cp2 =   { x: 120,   y: 30  };
// // let end =   { x: 150,   y: 70 };
// // let end2 =   { x: 200,   y: 100 };
// // const points = [start, cp1, cp2, end, end2];
// // for(const p of points) {
// //   ctx.fillStyle = 'red';
// //   ctx.beginPath();
// //   ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);  // Control point one
// //   ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);  // Control point two
// //   ctx.fill();
// // }

// const a = 1;


// html,
// body {
//   margin: 0;
//   padding: 0;
// }
// body {
//   background: linear-gradient(#50ABFF, #768EFF);
//   font-family: "黑体";
//   width: 100%;
//   display: flex;
//   flex-direction: column;
// }
// .blocks {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   position: fixed;
//   padding: 0.56rem;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: transparent;
//   z-index: 1060;
//   overflow-y: auto;
//   background-color: rgba(0, 0, 0, 0.4);
//   align-items: center;
// }
// .blocks.hidden {
//   display: none;
// }
// .blocks .intext {
//   width: 100%;
//   background-color: white;
//   border-radius: 0.26rem;
//   padding: 0.72rem;
// }
// .blocks .intext h5 {
//   text-align: center;
//   font-size: 0.5rem;
//   margin: 0 0 10px 0;
// }
// .blocks .intext .content {
//   font-size: 0.32rem;
// }
// section.head {
//   margin-left: 0.74rem;
//   margin-top: 0.5rem;
// }
// section.head .title {
//   min-height: 0.66rem;
//   color: #fff;
//   line-height: 0.66rem;
//   font-size: 0.38rem;
//   max-width: 6.4rem;
// }
// section.head .times {
//   color: #fff;
//   height: 0.66rem;
//   line-height: 0.66rem;
//   font-size: 0.32rem;
//   font-weight: 100;
// }
// section.head .close {
//   float: right;
//   top: 0.64rem;
//   position: absolute;
//   right: 0.64rem;
//   font-size: 0.44rem;
//   width: 0.64rem;
//   height: 0.64rem;
//   border-radius: 0.32rem;
//   line-height: 0.64rem;
//   text-align: center;
//   color: #fff;
//   border: 1px solid #fff;
// }
// section.info {
//   margin-top: 0.4rem;
//   margin-left: 0.46rem;
//   margin-right: 0.46rem;
//   background: #FFFFFF;
//   border-radius: 0.5rem;
//   padding: 0.68rem;
//   overflow: hidden;
// }
// section.info .split {
//   height: 0.8rem;
// }
// section.info .line {
//   display: flex;
//   flex-direction: row;
//   flex-wrap: nowrap;
//   justify-content: space-between;
// }
// section.info .line .panel {
//   font-size: 0.32rem;
//   flex-basis: 50%;
// }
// section.info .line .panel .ft {
//   margin: 0 0.6rem;
// }
// section.info .line .panel .h {
//   font-size: 0.32rem;
//   color: #999;
// }
// section.info .line .panel .cont {
//   height: 1.06rem;
// }
// section.info .line .panel .cont .ht {
//   line-height: 1.06rem;
//   font-size: 0.6rem;
//   color: #333;
//   display: inline-block;
// }
// section.info .line .panel .cont .ext {
//   display: inline-block;
//   height: 0.46rem;
//   font-size: 1.3rem 0.2;
//   line-height: 0.46rem;
// }
// section.info .line .panel .cont .down {
//   color: #24AD13;
// }
// section.info .line .panel .cont .down::before {
//   content: '-';
// }
// section.info .line .panel .cont .up {
//   color: #DD0808;
// }
// section.info .line .panel .cont .up::before {
//   content: '+';
// }
// section.stat {
//   margin-top: 0.4rem;
//   margin-left: 0.46rem;
//   margin-right: 0.46rem;
//   padding: 0.42rem 0.36rem;
//   background: #FFFFFF;
//   border-radius: 0.5rem;
//   overflow: hidden;
//   display: flex;
//   flex-wrap: nowrap;
// }
// section.stat .shadow {
//   box-shadow: 1.2px 0 0 #ddd;
//   transition: box-shadow 0.7s linear;
// }
// section.stat .left {
//   flex-shrink: 0;
//   width: 1.26rem;
// }
// section.stat .left .tp {
//   height: 1.26rem;
//   line-height: 1.26rem;
//   border-radius: 0.63rem;
//   font-size: 0.4rem;
//   color: #FFFFFF;
//   text-align: center;
//   background-color: #639DFF;
//   margin-bottom: 0.2rem;
// }
// section.stat .left .tp.lt {
//   background-color: #FDC004;
//   margin-bottom: 0;
// }
// section.stat .right {
//   flex-grow: 1;
//   overflow: auto;
// }
// section.stat .right::-webkit-scrollbar {
//   display: none;
// }
// section.stat .right .it {
//   display: flex;
//   width: 9rem;
//   margin-bottom: 0.2rem;
//   height: 1.26rem;
// }
// section.stat .right .it > .case {
//   display: flex;
//   flex-direction: column;
//   justify-content: space-evenly;
//   text-align: center;
//   flex-basis: 1.8rem;
//   height: 1.26rem;
// }
// section.stat .right .it > .case .l {
//   height: 0.5rem;
//   line-height: 0.5rem;
//   font-size: 0.36rem;
// }
// section.stat .right .it > .case .v {
//   height: 0.56rem;
//   line-height: 0.56rem;
//   font-size: 0.4rem;
// }
// section.pho {
//   margin-top: 0.4rem;
//   margin-left: 0.46rem;
//   margin-right: 0.46rem;
//   margin-bottom: 0.46rem;
//   background: #FFFFFF;
//   border-radius: 0.5rem;
//   overflow: hidden;
//   padding: 5px;
// }
// section.pho .center {
//   margin: auto;
// }
// section.demo {
//   margin-top: 0.4rem;
//   margin-left: 0.46rem;
//   margin-right: 0.46rem;
//   margin-bottom: 0.46rem;
//   background: #FFFFFF;
//   border-radius: 0.5rem;
//   overflow: hidden;
//   padding: 5px;
// }
// section.demo .center {
//   margin: auto;
// }



// const mid = (p1, p2) => {
//   return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
// };

// const dis = (p1, p2) => Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));

// const inc = (p, vector, head, radio = 0.5) => {
//   let { x, y } = p;
//   const { arc, div, len } = vector;
//   if(head) {
//     const ll = len * div * radio;
//     x -= ll;
//     y -= (ll * arc);
//   } else {
//     const ll = len * (1 - div) * radio;
//     x += ll;
//     y += (ll * arc);
//   }
//   return { x, y };
// };

// const as = [];
// for(let i = 1; i < points.length; i += 1) {
//   as.push(mid(points[i - 1], points[i]));
// }
// const vectors = [];
// for(let i = 1; i < as.length; i += 1) {
//   const arc = (as[i].y - as[i - 1].y) / (as[i].x - as[i - 1].x);
//   const dp1 = dis(points[i - 1], points[i]);
//   const dp2 = dis(points[i + 1], points[i]);
//   const div = dp1 / (dp2 + dp1);
//   const len = (as[i].x - as[i - 1].x);
//   vectors.push({ arc, len, div });
// }
// const radio = 0.6;
// const params = [];
// for(let i = 0; i < points.length - 1; i += 1) {
//   const c = points[i];
//   const n = points[i + 1];
//   if(i === 0) {
//     const v = vectors[0];
//     const h = inc(n, v, true, radio);
//     params.push([c.x, c.y, h.x, h.y, h.x, h.y, n.x, n.y]);
//   } else if(i === points.length - 2) {
//     const v = vectors[i - 1];
//     const h = inc(c, v, false, radio);
//     params.push([c.x, c.y, h.x, h.y, h.x, h.y, n.x, n.y]);
//   } else {
//     const v1 = vectors[i - 1];
//     const v2 = vectors[i];
//     const h1 = inc(c, v1, false, radio);
//     const h2 = inc(n, v2, true, radio);
//     params.push([c.x, c.y, h1.x, h1.y, h2.x, h2.y, n.x, n.y]);
//   }
// }
// console.log(params);

// //- for(const ps of params ) {
// //-     ctx.fillStyle = 'blue';
// //-     ctx.beginPath();
// //-     ctx.arc(ps[2], ps[3], 5, 0, 2 * Math.PI);
// //-     ctx.arc(ps[2], ps[3], 5, 0, 2 * Math.PI);
// //-     ctx.arc(ps[4], ps[5], 5, 0, 2 * Math.PI);
// //-     ctx.arc(ps[4], ps[5], 5, 0, 2 * Math.PI);
// //-     ctx.fill();
// //-     ctx.beginPath();
// //-     ctx.moveTo(ps[2], ps[3]);
// //-     ctx.lineTo(ps[4], ps[5]);
// //-     ctx.stroke();
// //- }
// for(const ps of params ) {
//   ctx.beginPath();
//   ctx.moveTo(ps[0], ps[1]);
//   ctx.bezierCurveTo(ps[2], ps[3], ps[4], ps[5], ps[6], ps[7],);
//   ctx.stroke();
// }