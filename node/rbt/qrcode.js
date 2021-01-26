const fs = require('fs');
const qrcode = require('../service/qrcode');


(async () => {
  const file = '/Users/yj431/cpdd.png';
  if (fs.existsSync(file)) fs.unlinkSync(file);
  const buf = await qrcode.qrbuf('i am ppp', 'sankooc');
  const url = await qrcode.uploadBuf(buf);
  console.log(url);
})();
