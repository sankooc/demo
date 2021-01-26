
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const ip = require('ip');


exports.createToken = (serv, version = '0.0.0', clientName='statistic') => {
  const commonRequest = {
    requestId: uuid(),
    version,
    timestamp: Date.now,
    clientName,
  };
  return jwt.sign({ sub: JSON.stringify(commonRequest) }, serv);
};