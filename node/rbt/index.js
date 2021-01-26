import compose from 'koa-compose';
import isEmpty from 'lodash/isEmpty';
import passport from 'koa-passport';
import AccessToken from '../libs/models/AccessToken';
import User from '../libs/models/User';

const _ = require('lodash');
const config = require('config').cas;

const factory = require('../libs/authservice');

const authService = factory.create(config);

const redirectToSSO = (ctx) => {
  const q = {
    service: 'console',
    oauth_callback: encodeURIComponent(config.authUrl),
  };
  const rapi = `${config.ssoUrl}?${Object.keys(q).map(k => k + '=' + q[k]).join('&')}`;
  ctx.response.redirect(rapi);
};

const commonResolv = async (ticket, ctx, next) => {
  const handleError = () => {};
  if(!ticket) {
    return redirectToSSO(ctx);
  }
  const res = await authService.checkTicket(ticket);
  const { resultStatus, data } = res;
  switch(resultStatus.errorCode) {
    case 0: {
      const { userId } = data;
      // const userId = data.userName;
      console.log('sso-auth userid', userId);
      if(_.get(ctx, 'state.user.id') === userId) {
        console.log('free-pass');
      } else {
        console.log('re-login');
        const user = await User.findById(userId);
        console.log('reload user info');
        // console.dir(user);
        await ctx.login(user);
      }
      ctx.session.ticket = ticket;
      await next();
      break;
    }
    case 401:
      redirectToSSO(ctx);
      break;
      default:
        ctx.body = { error: 'error' };
  }
};
exports.redirect = redirectToSSO;

exports.checkauth = async (ctx, next) => {
  console.log('auth check');
  const { accounttraceid } = ctx.query;
  console.log('toauth', ctx.query);
  await commonResolv(accounttraceid, ctx, next);
};
exports.logout = async (ctx, next) => {
  console.log('logout');
  const { ticket } = ctx.session;
  if(ticket){
    await authService.destroyTicket(ticket);
    ctx.session.ticket = undefined;
  }
  await ctx.logout();
  ctx.redirect('/');
};

passport.serializeUser((user, done) => {
  (async function() {
    if(user) {
      await authService.cacheUser(user);
      // const value = JSON.stringify(user);
      // // 设置用户缓存
      
      // await redis.setValueWithExpire(user.id, value, accessTokenExpiration);

      done(null, user.id);
    } else {
      done(null, null);
    }
  })();
});

passport.deserializeUser((id, done) => {
  (async function() {
    try {
      let u = await authService.cacheUser(id);
      if(!u) {
        const user = id ? await User.findById(id).select(`${User.DEEP_SELECT_FIELDS} thirds`) : null;
        u = user ? user.toObject() : {};
      }
      delete u.password;
      delete u.afile;
      done(null, u);
    } catch(error) {
      done(error);
    }
  })();
});

// 绑定用户
exports.binduser = async function binduser(ctx, next) {
  if(!isEmpty(ctx.state.user)) await next();
  else {
    const accessToken = ctx.request.headers.accesstoken || ctx.request.body.accesstoken;
    if(accessToken) {
      const token = await AccessToken.get(accessToken);
      if(!token) await next();
      else {
        const user = await User.findById(token.user).select(User.DEEP_SELECT_FIELDS);
        await ctx.login(user);
        await next();
      }
    } else await next();
  }
};
exports.logged = async function logged(ctx, next) {
  console.log('check login ');
  const { ticket } = ctx.session;
  await commonResolv(ticket, ctx, next);
};
exports.auth = function auth() {
  return compose([
    passport.initialize(),
    passport.session(),
  ]);
};
