'use strict';

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
    http.get(`http://dlockly.glitch.me/`);
  }, 280000);

  this.bot.on("ready", () => {
    this.bot.user.setActivity("with blocks. https://dlockly.glitch.me");
  });

  server.db.prepare("CREATE TABLE if not exists logindata (userid TEXT PRIMARY KEY, sessionkey TEXT, authkey TEXT);").run();
  server.db.prepare("CREATE TABLE if not exists votedata (userid TEXT PRIMARY KEY, votes NUMBER, totalVotes NUMBER);").run();
  server.bot.login(process.env.DISCORD_TOKEN);
}