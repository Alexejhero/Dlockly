'use strict';
module.exports = function (data) {
  if (data.auth.sessionValid(data.authUserID, data.authSession, data.db)) {
    data.auth.clearCookies(data.res);
    data.auth.removeToken(data.authUserID, data.db);
  }
  data.res.redirect("/");
}