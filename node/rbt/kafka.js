const config = require('config');
const moment = require('moment');
// const kafka = require('node-rdkafka');
// console.log(kafka.librdkafkaVersion);

const topic = 'topic-test';
const df = {
  'client.id': 'opslog',
  // 'metadata.broker.list': '127.0.0.1:9092',
  'bootstrap.servers': '192.168.100.25:9092',
  'compression.codec': 'snappy',
  'group.id': 'opslogs',
};

const proc = () => {
  const pconf = { ...df, dr_cb: true };
  const producer = new kafka.Producer(pconf);
  producer.connect();
  const producting = () => {
    try {
      const pro = producer.produce(
        topic,
        null,
        Buffer.from('abcd'),
        'key',
        Date.now(),
      );
      console.log(pro);
    } catch (err) {
      console.error('A problem occurred when sending our message');
      console.error(err);
    }
  };
  producer.on('ready', () => {
    console.log('ready');
    producting();
  }).on('event.error', (err) => {
    console.error('Error from producer');
    console.error(err);
  });
};
const cons = () => {
  const ccof = { ...df, 'enable.auto.commit': false, 'batch.num.messages': 1 };

  const consumer = new kafka.KafkaConsumer(ccof, {});
  consumer.connect();
  consumer.on('ready', () => {
    console.log('consumer ready');
    consumer.subscribe([topic]);
    consumer.consume();

    // setInterval(function() {
    //   consumer.consume(1);
    // }, 1000);
  }).on('data', (data) => {
    console.log('--get--');
    console.log(data.offset);
    console.log(moment(data.timestamp).format('HH:mm:ss'));
    // if(data.offset === 23) {
    //   consumer.commitMessage(data);
    // }
  });
};

proc();
cons();
proc();
