const server = require('../server');

module.exports.isAdmin = function (user) {
  var memberInOurGuild = this.dlocklyGuild(server.bot).member(user);
  if (memberInOurGuild && memberInOurGuild.roles.has('601489434084507649')) return true;
  else return false;
}

module.exports.dlocklyGuild = function () {
  return server.bot.guilds.get('591692042304880815');
}