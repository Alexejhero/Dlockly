'use strict';

const consts = require('./consts');
const server = require('../server');

module.exports.isAdmin = function (user) {
  var memberInOurGuild = consts.dlocklyGuild().member(user);
  if (memberInOurGuild && memberInOurGuild.roles.has('520016204862062603')) return true;
  else return false;
}