// require('../prepare');

const { kafka } = require('../service/mq');


(async () => {

  const data = Array.from({ length: 15 }).map((i, inx) => {
    console.log(inx);
    const list = ['消息', '警告', '异常'];
    const type = list[Math.round(Math.random() * 2)];
    console.log(type);
    return {
      type,
      source: 'aapi',
      title: '消息:' + inx,
      content: '发生异常详情blalalalallalalal',
      ts: Date.now(),
    };
  });
  await kafka.publishs('acms_info', data);
  // console.log('finish');
})();
