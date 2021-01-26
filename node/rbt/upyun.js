
const upyun = require('upyun');

exports.create = (logger, config) => {
  const { bucket, uname, password, domain, prefix } = config.upyun;
  logger.info('trace', 'upyun_config', bucket, uname, password, domain);
  const ubucket = new upyun.Bucket(bucket, uname, password);
  const client = new upyun.Client(ubucket, { domain });
  return {
    upload: async (filename, buf, option) => client.putFile(filename, buf, option),
  };
};