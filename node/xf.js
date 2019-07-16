const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const crypto = require('crypto');

const app = new Koa();

app.use(bodyparser({ strict: false }));
app.use(json());

const respd = async (ctx, next) => {
  console.log('resd');
  const rs = JSON.stringify(ctx.body).substring(3);
  ctx.body = rs;
  await next();
};
const process = async (ctx, next) => {
  // const { path, method, query } = ctx;
  // console.log('get');
  // console.log( path, method );
  // console.dir(query);
  ctx.body = { rc: 0 };
  await next();
};
app.use(process);
app.use(respd);

// app.listen('4040');
//.replace(/\+/g,'-').replace(/\//g,'_');
//openssl enc -aes-128-cbc -k secret -P -md sha1

const hash = (str, { algolism = 'sha1', encode = 'uft-8', rencode = 'hex' }) => {
  const hash_ = crypto.createHash(algolism);
  hash_.update(str, encode);
  return hash_.digest(rencode);
};

const criper = (skey, { algo = 'aes-128-cbc', padding = true, toEncode = 'utf-8', keyEncode = 'base64' }) => {
  const key = Buffer.from(skey, 'hex');
  const getIv = (key) => {
    // return new Buffer(0);
    // return crypto.randomBytes(16);
    return key;
  };
  const encrypt = (plaintext) => {
    if (!plaintext) return '';
    const iv = getIv(key);
    const cipher = crypto.createCipheriv(algo, key, iv);
    cipher.setAutoPadding(padding);
    let ciph = cipher.update(plaintext, toEncode, keyEncode);
    ciph += cipher.final(keyEncode);
    return ciph;
  };
  const decrypt = (data) => {
    if (!data) return '';
    const iv = getIv(key);
    const decipher = crypto.createDecipheriv(algo, key, iv);
    decipher.setAutoPadding(padding);
    let cun = decipher.update(data, keyEncode, toEncode);
    cun += decipher.final(toEncode);
    return cun;
  };
  return { encrypt, decrypt };
};

const skey = 'AD42F6697B035B7580E4FEF93BE20BAD';


// const content = '春天在哪里啊';


const { encrypt, decrypt } = criper(skey, {});


// const empc = encrypt(content);
// console.log(empc);
// const ot = decrypt(empc);
// console.log(ot);
// console.log(ot === content);

const TOKEN = '';

const decoder = async (ctx, next) => {
  const { signature, rand, timestamp } = ctx.query;
  const list = [rand, timestamp, TOKEN].sort();
  const los = list.join('');
  const sign = hash(los, {});
  if (sign === signature) {
    ctx.body = hash(TOKEN, {});
  } else {
    console.log('do something');
    // todo
  }
  await next();
};

const encoder = async (ctx, next) => {
  const content = ctx.body;
  
};
