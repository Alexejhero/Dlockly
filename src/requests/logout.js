const auth = require('../auth');
const server = require('../../server');

module.exports = function (data) {
  if (auth.sessionValid(data.authUserID, data.authSession, server.db)) {
    auth.clearCookies(data.res);
    auth.removeToken(data.authUserID, server.db);
  }
  data.res.redirect("/");
}