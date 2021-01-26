const fs = require('fs');

const content = fs.readFileSync(__dirname + '/tcp.dump').toString();

const stats = content.split('\n');

let f = false;
const data = [];
for(const s of stats){
  if(s.startsWith('\t0x0030')) {
    f = true;
    const sp2 = s.split(' ');
    const s1 = sp2.slice(sp2.length - 6, sp2.length);
    data.push(...s1);
    continue;
  }
  if(f){
    const sp2 = s.split(' ');
    const s1 = sp2.slice(2, sp2.length);
    data.push(...s1);
  }
}

const d = [];
for(const ds of data){
  if(ds.length === 4) {
    d.push(parseInt(ds.substring(0, 2), 16));
    d.push(parseInt(ds.substring(2), 16));
  } else if (ds.length === 2){
    d.push(parseInt(ds, 16));
  }
}

const target = '/Users/sankooc/work/mmdb/asset/';
const fname = 'req.query';
const buf = Buffer.from(d);

fs.writeFileSync(`${target}${fname}.dump`, buf)
