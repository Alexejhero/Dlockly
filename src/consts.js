'use strict';

const server = require('../server');

module.exports.dlocklyGuild = function () {
  return server.bot.guilds.get(`${process.env.DISCORD_GUILD_ID}`);
}

module.exports.votesChannel = function () {
  return this.dlocklyGuild().channels.get('604057075391266827');
}
