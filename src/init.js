'use strict';

const http = require('http');

const consts = require('./consts');
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
    server.bot.user.setActivity("with blocks. https://dlockly.glitch.me");
  });

  server.db.prepare("CREATE TABLE if not exists logindata (userid TEXT PRIMARY KEY, sessionkey TEXT, authkey TEXT);").run();
  server.db.prepare("CREATE TABLE if not exists votedata (userid TEXT PRIMARY KEY, votes NUMBER, totalVotes NUMBER);").run();
  server.bot.login(process.env.DISCORD_TOKEN);
  
  setInterval(async () => {
    consts.memberCountChannel() && consts.memberCountChannel().setName(`${await getUsers()} Users`);
    consts.guildCountChannel() && consts.guildCountChannel().setName(`${server.bot.guilds.size} Guilds`);
  }, 30);
}

async function getUsers() {
  var guilds = server.bot.guilds.array();
  var u = 0;
  for (var i = 0; i < guilds.length; i++) {
    var guild = await server.bot.guilds.get(guilds[i].id).fetchMembers();
    u += guild.members.size;
  }
  return u;
}