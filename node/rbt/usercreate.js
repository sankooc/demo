
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const User = require('../libs/models/User');

(async function() {
  const mobile = '15010130247';
  const password = 'akb48';
  const sex = 1;
  const nickname = mobile;
  const lastLoginAt = new Date();
  const user = new User();
  user.salt = '6ae59fcb476a9b59ea194a0deab7ca01811e59273a13b82ccb874ec9930f9116';
  const pass = user.encryptPassword(password);
  user.hashedPassword = pass;
  user.role = ObjectID('5a323c35d8ff335661e6b826');
  user.mobile = mobile;
  user.sex = sex;
  user.nickname = nickname;
  user.lastLoginAt = lastLoginAt;
  console.log(pass);
  // await user.save();
  mongoose.disconnect();
})();
