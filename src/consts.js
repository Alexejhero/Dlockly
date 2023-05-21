const server = require('..');

module.exports.dlocklyGuild = function () {
  return server.bot.guilds.cache.get('591692042304880815');
}

module.exports.votesChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.cache.get('604057075391266827') : null;
}

module.exports.memberCountChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.cache.get('606230563770335232') : null;
}

module.exports.guildCountChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.cache.get('606230467514990613') : null;
}
