const request = require('request-promise');


module.exports.getTheme = function (req) {
  if (!req.cookies) return ""
  var theme = req.cookies["theme"] ? req.cookies["theme"] : "";
  return theme
}

module.exports.clearTheme = function (res) {
  res.clearCookie('theme');
}

