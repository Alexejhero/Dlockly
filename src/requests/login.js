'use strict';

const auth = require('../auth');
const server = require('../../server');

module.exports = function (data) {
  if (auth.sessionValid(data.authUserID, data.authSession)) data.res.redirect("/");
  else data.res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=591694201230721043&redirect_uri=https%3A%2F%2Fdlockly.glitch.me%2Fauth&response_type=code&scope=identify");
}