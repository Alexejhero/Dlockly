'use strict';

const Discord = require('discord.js');

const consts = require('./consts');
const discord = require('./discord');
const perms = require('./perms');
const server = require('../server');

module.exports.initialize = function () {
  server.dbl.webhook.on("vote", onvote);
}

function onvote(vote) {
  this.addVotes(vote.user, vote.isWeekend ? 2 : 1);
  var totalVotes = this.getVotes(vote.user);
  var user = server.bot.users.get(vote.user);
  if (perms.isAdmin(user)) totalVotes = "∞";
  var embed = new Discord.RichEmbed()
    .setDescription(`<@${vote.user}> has voted!`)
    .setColor(0x00FF00)
    .addField("Is Weekend", vote.isWeekend, true)
    .addField("Total Votes", totalVotes, true)
    .setFooter(user ? user.tag : "Unknown User", user ? user.avatarURL : undefined);
  consts.votesChannel.send({
    embed
  });
  console.log(`User with id ${vote.user} just voted! Total: ${totalVotes}`);
}

module.exports.getVotes = function (userid) {
  server.db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  return server.db.prepare("SELECT * FROM votedata WHERE userid=?;").get(userid).votes;
}

module.exports.getTotalVotes = function (userid) {
  server.db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  return server.db.prepare("SELECT * FROM votedata WHERE userid=?;").get(userid).totalVotes;
}

module.exports.addVotes = function (userid, number) {
  server.db.prepare("INSERT OR IGNORE INTO votedata (userid, votes, totalVotes) VALUES (?, ?, ?);").run(userid, 0, 0);
  server.db.prepare("UPDATE votedata SET votes = votes + ? WHERE userid=?;").run(number, userid);
  server.db.prepare("UPDATE votedata SET totalVotes = totalVotes + ? WHERE userid=?;").run(number, userid);
}