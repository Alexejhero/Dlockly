const dlockly = require('./dlockly');

module.exports.getUser = async function (bot, id) {
  return (await this.getUsers(bot))[id];
}

module.exports.getUsers = async function (bot) {
  var guilds = bot.guilds.array();
  var result = {};

  for (var guild of guilds) {
    var _guild = await bot.guilds.get(guild.id).fetchMembers();

    _guild.members.forEach((v, k) => result[k] = v);
  }

  return result;
}

module.exports.getConfigurableGuilds = function (bot, _member, adminAccessOnly = false) {
  var guilds = bot.guilds.array();
  var user = _member.user;

  var admin = false;
  var memberInOurGuild = bot.guilds.get('591692042304880815').member(user);
  if (memberInOurGuild && memberInOurGuild.roles.has('601489434084507649')) admin = true;

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