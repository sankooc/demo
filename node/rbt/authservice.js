
const _ = require('lodash');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const redis = require('./redis');
const { accessTokenExpiration } = require('./utils');

const toPromise = (fn, ...arg) => new Promise((resolve, reject) => {
  fn(...arg, (err, data) => {
    // console.log(err);
    // console.log(data)
    if(err) return reject(err);
    resolve(data);
  })
});
exports.create = (config) => {
  const { protoPath, casUrl } = config;
  
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  
  const { cas } = grpc.loadPackageDefinition(packageDefinition);

  const client = new cas.CASServer(
    casUrl,
    grpc.credentials.createInsecure()
  );

  const checkTicket = ticket => toPromise(client.ticketValidation.bind(client), { token: 'toto', ticket });
  const destroyTicket = ticket => toPromise(client.RemoveServiceTicket.bind(client), { ticket });

  const cacheUser = async (user) => {
    if(typeof user === 'object') {
      const id = user.id || user._id;
      const value = JSON.stringify(user);
      await redis.setValueWithExpire(id, value, accessTokenExpiration);
      return;
    }
    const id = user;
    const cache = await redis.getAsync(id);
    if(cache) {
      try {
        return JSON.parse(cache);
      } catch(e){
        console.error('parse cache user failed', cache);
      }
    }
    return null;
  }
  return { checkTicket, destroyTicket, cacheUser };
};
