'use strict';

const consts = require('./consts');

module.exports.isAdmin = function (user) {
  if (!user) return false;
  var memberInOurGuild = consts.dlocklyGuild().member(user);
  if (memberInOurGuild && (memberInOurGuild.roles.has(process.env.DISCORD_ROLE_ID) || memberInOurGuild.hasPermission("ADMINISTRATOR"))) return true;
  else return false;
}