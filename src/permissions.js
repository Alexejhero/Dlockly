module.exports.isAdmin = function (user, bot) {
  var memberInOurGuild = this.dlocklyGuild(bot).member(user);
  if (memberInOurGuild && memberInOurGuild.roles.has('601489434084507649')) return true;
  else return false;
}

module.exports.dlocklyGuild = function (bot) {
  return bot.guilds.get('591692042304880815');
}