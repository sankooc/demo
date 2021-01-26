// const fastjson = require('fastjson');



// const a = fastjson.stringify({ a: [], b: 'dsd'});
// console.log(a);


// JSON.stringify();


// const s = Date.now();

// for(let i = 0 ; i < 10 ; i += 1){
//   console.log(i);
// }


// settimeout(1-10)

const mj = require('../libs/adcode.json');


const pmap = {};
for(const p of mj) {
  const { value, label, children } = p;
  const cmap = {};
  pmap[label] = { value, label, map: cmap };
  for(const c of children) {
    const { value, label, children } = c;
    const dmap = {};
    cmap[label] = { value, label, map: dmap };
    for(const d of children) {
      const { value, label } = c;
      dmap[label] = value;
    }
  }
}

// console.log(mj);