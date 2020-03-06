const http = require('http');

const consts = require('./consts');
const errors = require('./errors');
const server = require('..');
const votes = require('./votes');

module.exports.bot = function () {
  setInterval(() => {
    http.get(`http://dlockly.glitch.me/`);
  }, 280000);

  server.bot.on("ready", () => {
    server.bot.user.setActivity("with blocks. https://dlockly.glitch.me");
    server.bot.guilds.size = server.bot.guilds.cache.size;
  });

  server.bot.on("guildCreate", () => {
    server.bot.guilds.size = server.bot.guilds.cache.size;
  });

  server.bot.on("guildDelete", () => {
    server.bot.guilds.size = server.bot.guilds.cache.size;
  });

  server.bot.login(process.env.DISCORD_TOKEN);

  setInterval(async () => {
    consts.guildCountChannel() && consts.guildCountChannel().setName(`${server.bot.guilds.cache.size} Guilds`);
    consts.memberCountChannel() && consts.memberCountChannel().setName(`${server.bot.users.cache.size} Users`);
  }, 10000);

  errors.initialize();
}

module.exports.db = function () {
  server.db.prepare("CREATE TABLE if not exists logindata (userid TEXT PRIMARY KEY, sessionkey TEXT, authkey TEXT);").run();
  server.db.prepare("CREATE TABLE if not exists votedata (userid TEXT PRIMARY KEY, votes NUMBER, totalVotes NUMBER);").run();
}

module.exports.dbl = function () {
  votes.initialize();
}