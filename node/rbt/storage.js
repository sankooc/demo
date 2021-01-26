
const upyun = require('upyun');
const md5File = require('md5-file/promise');
const mime = require('mime-types');
const fs = require('fs');

// const bucket = new upyun.Bucket('sp-images-yunji', 'backend', 'yunji2018');
// const client = new upyun.Client(bucket, { domain: 'v0.api.upyun.com' });
exports.create = (cfg) => {
  const { prefix, bucket, domain, username, password } = cfg;
  const service = new upyun.Bucket(bucket, username, password);
  const client = new upyun.Client(service, { domain });
  const upload = async (source) => {
    // const meta = mime.lookup(source);
    // console.log(meta);
    // if(fname === null) {
    //   const md5 = await md5File(source);
    // }
    // const res = await client.listDir('/acms/finance');
    // console.log(res);

    const fullname = 'acms/finance/test.xlsx';
    const result = await client.putFile(fullname, fs.createReadStream(source));
  };
  return { upload };
};

(async () => {
  const cfg = {
    prefix: 'http://images.sp.yunjichina.com.cn',
    bucket: 'sp-images-yunji',
    domain: 'v0.api.upyun.com',
    username: 'backend',
    password: 'yunji2018',
  };
  const source = `${__dirname}/test.xlsx`;
  await exports.create().upload(source);
})();
