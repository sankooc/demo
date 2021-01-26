const EventEmitter = require('events');

const table = new EventEmitter();
table.on('event', async (ctx) => {
  console.log(ctx);
  await new Promise(() => {});
  ctx.status = 1;
  console.log('an event occurred!');
  return false;
  // throw new Error('error ocur');
});

(async () => {
  const ctx = {
    status: 0
  };
  console.log(1);
  const log = table.emit('event', ctx);
  // console.log(log);
  console.log(2);
  console.log(ctx);
})();