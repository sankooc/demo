const lt = require('../service/ltask');




(async () => {
  const uid = 'dsad';
  const rs = await lt.create({ key: 'ordak', param: { cc: '123' } }, 'file', 'uid');
  console.log(rs);
  const li = await lt.list({
    user: uid,
    skip: 0,
    limit: 20,
  });
  console.dir(li);
})();
