'use strict';

const server = require('../server');

module.exports.dlocklyGuild = function () {
  return server.bot.guilds.get('519997113648676879');//
}

module.exports.votesChannel = function () {
  return this.dlocklyGuild().channels.get('604057075391266827');
}