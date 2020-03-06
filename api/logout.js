const auth = require('../src/auth');
const server = require('..');

module.exports = function (data) {
  if (auth.sessionValid(data.authUserID, data.authSession)) {
    auth.clearCookies(data.res);
    auth.removeToken(data.authUserID);
  }
  data.res.redirect("/");
}