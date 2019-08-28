const server = require('../server');

module.exports.dlocklyGuild = function () {
  return server.bot.guilds.get(process.env.DISCORD_GUILD_ID || '591692042304880815');
}

module.exports.votesChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.get(process.env.DISCORD_VOTE_CHANNEL || '604057075391266827') : null;
}

module.exports.memberCountChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.get(process.env.DISCORD_MEMBER_CHANNEL || '606230563770335232') : null;
}

module.exports.guildCountChannel = function () {
  return this.dlocklyGuild() ? this.dlocklyGuild().channels.get(process.env.DISCORD_GUILD_CHANNEL || '606230467514990613') : null;
}
