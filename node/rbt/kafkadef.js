

// const ip = require('ip');
const moment = require('moment');
const config = require('config');
const mq = require('../service/mq/kafka');
// const { Kafka, CompressionTypes, logLevel } = require('kafkajs');

const topic = 'storedata';
// const host = '192.168.100.25';

// const local = {
//   brokers: ['192.168.100.25:9092'],
//   clientId: 'example-producer',
// };
// const level = logLevel.INFO;

// const remote = {
//   brokers: ['ckafka-7d7hj41s.ap-shanghai.ckafka.tencentcloudmq.com:6058'],
//   clientId: 'example-producer',
//   sasl: {
//     mechanism: 'plain',
//     username: 'ckafka-7d7hj41s#terminator',
//     password: 'terminator',
//   },
// };
// console.log(require('config').topics.order);
// console.dir(config.kafka);
(async () => {
  const ops = {
    payment: 'wechat',
    tid: '5e71edbf22f84c4e950c4a91',
    order_version: 'base',
  };
  const mqService = mq.create(config.kafka);
  // console.log(mqService.publish);
  // await kafka.publishs(ORDER_TOPIC, datas);
  await mqService.publish('storedata', ops);
  // await mqService.subscribe('storedata', (msg) => {
  //   const data = JSON.parse(msg.value);
  //   console.dir(data);
  // });
})();


// return;
// const option = { logLevel: level, ...local };


// const productOption = {
//   acks: 1,
//   topic,
//   // compression: CompressionTypes.GZIP,
// };
// const consumeOption = {
//   groupId: 'opslogs',
// };

// const proc = () => {
//   const kafka = new Kafka(option);

//   const producer = kafka.producer();

//   const sendMessage = () => {
//     return producer
//       .send({ messages: [{ key: 'key1', value: { acdc: 'ads' } }], ...productOption })
//       .then(console.log)
//       .catch(e => console.error(`[example/producer] ${e.message}`, e))
//   };

//   const run = async () => {
//     await producer.connect();
//     setInterval(sendMessage, 5000);
//   };

//   run().catch(e => console.error(`[example/producer] ${e.message}`, e))

  // const errorTypes = ['unhandledRejection', 'uncaughtException']
  // const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

  // errorTypes.map(type => {
  //   process.on(type, async () => {
  //     try {
  //       console.log(`process.on ${type}`)
  //       await producer.disconnect()
  //       process.exit(0)
  //     } catch (_) {
  //       process.exit(1)
  //     }
  //   })
  // })

  // signalTraps.map(type => {
  //   process.once(type, async () => {
  //     try {
  //       await producer.disconnect()
  //     } finally {
  //       process.kill(process.pid, type)
  //     }
  //   })
  // })
// };

// const cons = () => {
//   const kafka = new Kafka(option);

//   const consumer = kafka.consumer(consumeOption);

//   const run = async () => {
//     await consumer.connect();
//     await consumer.subscribe({ topic, fromBeginning: true });
//     await consumer.run({
//       // autoCommit: false,
//       eachMessage: async ({ topic, partition, message }) => {
//         const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
//         console.log(`- ${prefix} ${message.key}#${message.value}`);
//         console.dir(topic);
//         console.dir(partition);
//         console.dir(message);
//         // const ms = [{ topic, partition, offset: message.offset }];
//         // console.log(ms);
//         // await consumer.commitOffsets(ms);
//       },
//     });
//     await consumer.seek({ topic, partition: 0, offset: '0' });
//   };
//   run();
// };

// proc();
// setTimeout(cons, 5000);
// cons();
