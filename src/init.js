const http = require('http');

const consts = require('./consts');
const errors = require('./errors');
const server = require('..');
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
    server.bot.user.setActivity("with blocks. https://dlockly.glitch.me");
  });

  server.db.prepare("CREATE TABLE if not exists logindata (userid TEXT PRIMARY KEY, sessionkey TEXT, authkey TEXT);").run();
  server.db.prepare("CREATE TABLE if not exists votedata (userid TEXT PRIMARY KEY, votes NUMBER, totalVotes NUMBER);").run();
  server.bot.login(process.env.DISCORD_TOKEN);

  setInterval(async () => {
    consts.guildCountChannel() && consts.guildCountChannel().setName(`${server.bot.guilds.size} Guilds`);
    consts.memberCountChannel() && consts.memberCountChannel().setName(`${server.bot.users.size} Users`);
  }, 10000);
}