const dlockly = require('./dlockly');
const perms = require('./perms');
const server = require('..');

module.exports.getUsers = async function () {
  var guilds = server.bot.guilds.cache.array();
  var result = {};

  for (var guild of guilds) {
    var _guild = await server.bot.guilds.cache.get(guild.id).fetchMembers();

    _guild.members.forEach((v, k) => result[k] = v);
  }

  return result;
}

module.exports.getConfigurableGuildsIncludingAdmin = function (_member) {
  return this.getConfigurableGuilds(_member).concat(this.getConfigurableGuilds(_member, true));
}

module.exports.getConfigurableGuilds = function (_member, adminAccessOnly = false) {
  var guilds = server.bot.guilds.cache.array();
  var user = _member.user;
  var admin = perms.isAdmin(user);

  var goodGuilds = [];
  for (var guild of guilds) {
    var member = guild.member(user);
    if (!member) continue;
    if (member.hasPermission('MANAGE_GUILD')) goodGuilds.push(guild);
  }

  if (!adminAccessOnly) return goodGuilds;
  else if (admin) return addEmptyMark(guilds.filter((e) => !goodGuilds.includes(e)));
  else return [];
}

function addEmptyMark(guilds) {
  for (var guild of guilds) {
    guild.hasEmptyConfig = dlockly.isConfigEmpty(guild.id);
  }
  return guilds;
}

module.exports.guildSort = function (a, b) {
  if (a.hasEmptyConfig && !b.hasEmptyConfig) return 1;
  else if (b.hasEmptyConfig && !a.hasEmptyConfig) return -1;
  return a.name.localeCompare(b.name);
}