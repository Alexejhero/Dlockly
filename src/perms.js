'use strict';

const consts = require('./consts');
const server = require('../server');

module.exports.isAdmin = function (user) {
  var memberInOurGuild = consts.dlocklyGuild(server.bot).member(user);
  if (memberInOurGuild && memberInOurGuild.roles.has('601489434084507649')) return true;
  else return false;
}