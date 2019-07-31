'use strict';

const server = require('../server');

module.exports.dlocklyGuild = function () {
  return server.bot.guilds.get('591692042304880815');
}

module.exports.votesChannel = function () {
  return this.dlocklyGuild().channels.get('604057075391266827');
}

module.exports.memberCountChannel = function () {
  return this.dlocklyGuild().channels.get('606230563770335232');
}

module.exports.guildCountChannel = function () {
  return this.dlocklyGuild().channels.get('606230467514990613');
}