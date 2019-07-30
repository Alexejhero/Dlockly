'use strict';
const auth = require('../auth');
const perms = require('../perms');
const server = require('../../server');

module.exports = async function (data) {
  if (!auth.sessionValid(data.authUserID, data.authSession, server.db) || !data.user || !perms.isAdmin(data.user.user, server.bot)) {
    data.res.redirect(`/?guild=${data.req.query.guild}#invalidLogin`);
    return;
  }

  var guild = server.bot.guilds.get(data.req.query.guild);
  if (!guild) {
    data.res.redirect(`/?guild=${data.req.query.guild}#invalidGuild`);
    return;
  }

  if (guild.me.hasPermission("MANAGE_GUILD")) {
    if (guild.features.includes("VANITY_URL")) {
      var vanityUrl = await guild.fetchVanityCode();
      if (vanityUrl) {
        data.res.redirect(`https://discord.gg/${vanityUrl}`);
        return;
      }
    }

    var invites = (await guild.fetchInvites()).keyArray();
    if (invites[0]) {
      data.res.redirect(`https://discord.gg/${invites[0]}`);
      return;
    }
  }

  if (guild.me.hasPermission("CREATE_INSTANT_INVITE")) {
    var channels = await guild.channels.array();
    channels = channels.filter(c => c.type == "text" || c.type == "voice");
    if (channels[0]) {
      var invite = await channels[0].createInvite({
        maxAge: 86400,
        maxUses: 1,
        unique: true,
      }, "Invite requested by a Dlockly administrator");
      data.res.redirect(`https://discord.gg/${invite}`);
      return;
    }
  }

  data.res.redirect(`/?guild=${data.req.query.guild}#missingPermissions`);
}