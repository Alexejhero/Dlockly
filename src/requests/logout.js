'use strict';

const auth = require('../auth');
const server = require('../../server');

module.exports = function (data) {
  if (auth.sessionValid(data.authUserID, data.authSession)) {
    auth.clearCookies(data.res);
    auth.removeToken(data.authUserID);
  }
  data.res.redirect("/");
}