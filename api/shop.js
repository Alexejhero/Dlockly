const path = require("path");

const auth = require("../src/auth");
const discord = require("../src/discord");
const dlockly = require("../src/dlockly");
const perms = require("../src/perms");
const server = require("..");

module.exports = function (data) {
  if (!auth.sessionValid(data.req.cookies.auth_userid, data.req.cookies.auth_session, server.db) || !data.user) return data.res.redirect("/#invalidLogin");
  var guilds = discord.getConfigurableGuilds(data.user).concat(discord.getConfigurableGuilds(data.user, true)).map(g => g.id);
  if (!guilds.includes(data.req.query.guild)) return data.res.redirect("/#invalidGuild");

  var dlocklyInstance = dlockly.initialize(false);
  dlocklyInstance.blocks.forEach(b => b.mutator = undefined);

  data.res.render("www/html/shop.ejs", {
    blocks: dlocklyInstance.blocks.filter(b => b.cost),
    guildName: server.bot.guilds.cache.get(data.req.query.guild).name,
    guildId: data.req.query.guild,
    invite: perms.isAdmin(data.user.user),
    paypalId: process.env.PAYPAL_ID,
  });
}