require('dotenv').config();

const DBL = require('dblapi.js');
const Discord = require('discord.js');
const express = require('express');
const fs = require('fs');
const http = require("http");
const path = require('path');
const read = require('fs-readdir-recursive');

const auth = require('./src/auth');
const discord = require('./src/discord');
const dlockly = require('./src/dlockly');
const perms = require('./src/permissions');
const votes = require('./src/votes');
const theme = require('./src/theme');

const web = express();
web.set("views", __dirname);
web.use(require('express-useragent').express());
web.use(require('cookie-parser')());
web.use(require('body-parser').json());
web.use(require('body-parser').urlencoded({
  extended: false
}));
const bot = new Discord.Client();
const dbl = new DBL(process.env.DBL_TOKEN, {
  webhookPort: process.env.PORT,
  webhookAuth: process.env.DBL_WEBHOOK_AUTH,
  webhookServer: web.listen(process.env.PORT),
}, bot);
const db = require('better-sqlite3')('data/db.db');

web.all('*', async (req, res) => {
  if (fs.existsSync(path.join(__dirname, "/config/disable"))) {
    res.render(path.join(__dirname, "/www/html/maintenance.ejs"), {
      theme: theme.getTheme(req),
    });
    return;
  }

  var browser = req.useragent.browser;
  if (browser != "Chrome" && browser != "Firefox") {
    res.render(path.join(__dirname, "/www/html/browserunsup.ejs"), {
      theme: theme.getTheme(req),
    });
    return;
  }

  var {
    authUserID,
    authSession
  } = auth.getCookies(req);
  var user = await discord.getUser(bot, authUserID);

  if (req.path.endsWith(".js") || req.path.endsWith(".css") || req.path.endsWith(".ico") || req.path.endsWith(".html")) {
    res.sendFile(path.join(__dirname, req.path));
  } else if (fs.existsSync(path.join(__dirname, "/src/requests/", req.path + ".js"))) {
    require('./' + path.join('src/requests/', req.path))({
      auth,
      authSession,
      authUserID,
      bot,
      db,
      discord,
      perms,
      res,
      req,
      user,
      theme,
    });
  } else {
    if (!auth.sessionValid(authUserID, authSession, db)) {
      res.render(path.join(__dirname, "/www/html/login.ejs"), {
        theme: theme.getTheme(req),
      });
      return;
    }

    if (!user) {
      res.render(path.join(__dirname, "/www/html/unknownuser.ejs"), {
        theme: theme.getTheme(req),
      });
      return;
    }

    if (!discord.getConfigurableGuilds(bot, user).concat(discord.getConfigurableGuilds(bot, user, true)).map(g => g.id).includes(req.query.guild)) {
      res.render("www/html/guildpicker.ejs", {
        user: user,
        adminGuilds: discord.getConfigurableGuilds(bot, user, true).sort(discord.guildSort),
        configurableGuilds: discord.getConfigurableGuilds(bot, user).sort(discord.guildSort),
        theme: theme.getTheme(req),
      });
      return;
    }

    var categories = dlockly.initializeAllCategoriesRecursively();
    var {
      blocks,
      max,
      restrictions,
      generators
    } = dlockly.initializeAllBlocks(categories);

    res.render("www/html/dlockly.ejs", {
      blocks: blocks,
      max: JSON.stringify(max),
      categories: categories,
      restrictions: JSON.stringify(restrictions),
      xmlCategoryTree: dlockly.generateXmlTreeRecursively(categories),
      generators: generators,
      blocklyXml: dlockly.getBlocklyXml(req.query.guild),
      exampleXml: dlockly.getExampleXml(),
      guildName: bot.guilds.get(req.query.guild).name,
      guildId: bot.guilds.get(req.query.guild).id,
      invite: perms.isAdmin(user.user, bot),
      theme: theme.getTheme(req),
    });
  }
});

setInterval(() => {
  http.get(`http://dlockly.glitch.me/`);
}, 280000);

bot.on("ready", () => {
  bot.user.setActivity("with blocks. https://dlockly.glitch.me");

  var configs = [];

  var files = read(path.join(__dirname, "data")).filter(f => f.endsWith(".js"));

  for (var f of files) {
    if (f.startsWith("/") || f.startsWith("\\")) f = f.substring(1);
    if (f.endsWith("/") || f.endsWith("\\")) f.substr(0, f.length - 1);

    //eval(fs.readFileSync(path.join(p, f)));
  }
});

dbl.webhook.on("vote", vote => {
  votes.addVotes(vote.user, vote.isWeekend ? 2 : 1, db);
  var totalVotes = votes.getVotes(vote.user, db);
  var user = bot.users.get(vote.user);
  var embed = new Discord.RichEmbed()
    .setDescription(`<@${vote.user}> has voted!`)
    .setColor(0x00FF00)
    .addField("Is Weekend", vote.isWeekend, true)
    .addField("Total Votes", totalVotes, true)
    .setFooter(user ? user.tag : "Unknown User", user ? user.avatarURL : undefined);
  bot.guilds.get('591692042304880815').channels.get('604057075391266827').send({
    embed
  });
  console.log(`User with id ${vote.user} just voted! Total: ${totalVotes}`);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: ', p, 'reason:', reason);
});

bot.on('error', (e) => {
  console.error(e);
})

bot.on('warn', (w) => {
  console.warn(w);
});

db.prepare("CREATE TABLE if not exists logindata (userid TEXT PRIMARY KEY, sessionkey TEXT, authkey TEXT);").run();
db.prepare("CREATE TABLE if not exists votedata (userid TEXT PRIMARY KEY, votes NUMBER, totalVotes NUMBER);").run();
bot.login(process.env.DISCORD_TOKEN);
