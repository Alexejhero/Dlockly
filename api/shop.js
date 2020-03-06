const path = require('path');

const auth = require('../src/auth');
const discord = require('../src/discord');
const perms = require('../src/perms');
const server = require('..');
const shop = require('../src/shop');

module.exports = function (data) {
  if (!auth.sessionValid(data.req.cookies.auth_userid, data.req.cookies.auth_session, server.db) || !data.user)
    return data.res.redirect("/#invalidLogin");
  var guilds = discord.getConfigurableGuilds(data.user).concat(discord.getConfigurableGuilds(data.user, true)).map(g => g.id);
  if (!guilds.includes(data.req.query.guild))
    return data.res.redirect("/#invalidGuild");

  var blocks = shop.loadBlocks(path.join(__dirname, "/../blocks/custom")).filter(b => !shop.getPurchasedBlocks(data.req.query.guild)[b.block.type]);

  data.res.render("www/html/shop.ejs", {
    blocks,
    guildName: server.bot.guilds.cache.get(data.req.query.guild).name,
    guildId: data.req.query.guild,
    invite: perms.isAdmin(data.user.user),
    paypalId: process.env.PAYPAL_ID,
  });
}