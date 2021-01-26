const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const log4js = require('log4js');

require('./prepare.js');
const logger = log4js.getLogger('default');

const def = { host: 'cas-redis', db: 4, port: 6379 };

const opt = def;

logger.info('load-redis-option', JSON.stringify(opt));

const client = redis.createClient(opt);

client.on('error', (err) => { logger.info(`Redis Error ${err}`, 'App'); });
client.on('ready', () => { logger.info('Redis Ready Now', 'App'); });
client.on('connect', () => {});

client.setValueWithExpire = async function(k, v, expire) {
  await client.setAsync(k, v);
  await client.expireAsync(k, parseInt(expire));
};

client.setHashValueWithExpire = async function(k, v, expire) {
  await client.hmsetAsync(k, v);
  await client.expireAsync(k, parseInt(expire));
};

(async () => {
  await client.setValueWithExpire('demo', 'test', 400);
  console.log('done');
})()

module.exports = client;
