'use strict';

const http = require('http');

const errors = require('./errors');
const server = require('../server');
const votes = require('./votes');

module.exports = function () {
  initialize();
  errors.initialize();
  votes.initialize();
}

function initialize() {
  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  }, 280000);

  server.bot.on("ready", () => {
    server.bot.user.setActivity("with blocks. https://"+process.env.PROJECT_DOMAIN+".glitch.me");
  });

  server.db.prepare("CREATE TABLE if not exists logindata (userid TEXT PRIMARY KEY, sessionkey TEXT, authkey TEXT);").run();
  server.db.prepare("CREATE TABLE if not exists votedata (userid TEXT PRIMARY KEY, votes NUMBER, totalVotes NUMBER);").run();
  server.bot.login(process.env.DISCORD_TOKEN);
}
