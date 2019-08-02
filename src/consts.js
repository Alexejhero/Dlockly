'use strict';

const server = require('../server');

module.exports.dlocklyGuild = function () {
  return server.bot.guilds.get(`${process.env.DISCORD_GUILD_ID}`);
}

module.exports.votesChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.get('604057075391266827') : null;
}

module.exports.memberCountChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.get('606230563770335232') : null;
}

module.exports.guildCountChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.get('606230467514990613') : null;
}