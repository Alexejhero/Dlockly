'use strict';

const consts = require('./consts');

module.exports.isAdmin = function (user) {
  var memberInOurGuild = consts.dlocklyGuild().member(user);
  if (memberInOurGuild && (memberInOurGuild.roles.has('601489434084507649') || memberInOurGuild.hasPermission("ADMINISTRATOR"))) return true;
  else return false;
}