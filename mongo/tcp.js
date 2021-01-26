const fs = require('fs');
const BSON = require('bson');
// const readline = require('readline');


// const aa = {
//   whatsmyuri: 1,
//   $db: 'admin'
// };

// const d12 = BSON.serialize(aa);
// console.log('data:', d12);
// console.log('data:', d12.length);

// // Deserialize the resulting Buffer
// const doc_5 = BSON.deserialize(d12);
// console.log('doc_2:', doc_5);
// var crc32 = require('fast-crc32c');
// works with buffers

const content = fs.readFileSync(__dirname + '/tcp.dump').toString();

const stats = content.split('\n');
// console.log(stats);
// console.log(stats);
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

// const bufff = Buffer.from(d.slice(0, d.length - 2));
// var cresult = crc32.calculate(bufff);
// console.log(cresult);
// const llow = cresult & 0x000000ff;
// console.log(llow);
// const m = Buffer.from(d.slice(d.length - 4));
// console.log(m);


const len = d[0];
console.log('total lenth', len);
// console.log(d[12]);
const code = Buffer.from([d[12], d[13], d[14], d[15]]).readUInt32LE();
console.log('code', code);
const ss = d.splice(16);
// console.log(ss);


const buf = Buffer.from(ss);
const flagBits = buf.readUInt32LE(0);
console.log('flagBits', flagBits);


let cur = 4;

const readCstring = () => {
  const start = cur;
	for (; cur < buf.length; cur += 1) {
		if (buf.readUInt8(cur) == 0) {
			return buf.slice(start, cur).toString('utf-8');
		}
	}
	return ""
}

const parseSection = () => {
  const ll = buf.readUInt32LE(cur);
  console.log('doc-size', ll);
  const jj = buf.slice(cur, cur + ll);
  cur += ll;
  return BSON.deserialize(jj);
};
const section1 = () => {
  const docLen = buf.readUInt32LE(cur);
  console.log('section_1 size', docLen)
  const finishCur = cur + docLen;
  cur += 4;
  const cs = readCstring()
  console.log('cs', cs)
  cur += 1
  const arr = [];
  while(true) {
    const doc = parseSection()
    arr.push(doc);
    if(finishCur <= cur) break;
  }
  return arr;
}
while(true){
  if(buf.length - cur <= 4){
    break;
  }
  const section = buf.readUInt8(cur++);
  console.log('section', section, ' cursor:', cur);
  if(section === 0){
    const doc = parseSection();
    console.dir(doc);
    // console.dir(doc.cursor.firstBatch);
  } else if(section === 1){
    const docs = section1();
    console.dir(docs);
  } else {
    throw new Error("exp")
  }
}
// return;
// console.log('cur', cur);
// console.log(buf.length);

// console.log(len);