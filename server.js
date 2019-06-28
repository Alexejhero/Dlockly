require('dotenv').config();
const http = require("http");
const express = require('express');
const Discord = require('discord.js');
const fs = require('fs');
const read = require('fs-readdir-recursive');
const path = require('path');
const querystring = require('querystring');
const request = require('request-promise');

const auth = require('./src/auth');
const icons = require('./config/icons.json');

var web = express();
web.set("views", __dirname);
web.use(require('express-useragent').express());
web.use(require('cookie-parser')());
const bot = new Discord.Client();

var db = require('better-sqlite3')('data/db.db');

async function boot() {
  db.prepare("CREATE TABLE if not exists logindata (userid TEXT PRIMARY KEY, sessionkey TEXT, authkey TEXT);").run();
  web.listen(process.env.PORT);
  bot.login(process.env.DISCORD_TOKEN);
}

web.get('*', async (req, res) => {
  var {
    authUserID,
    authSession
  } = auth.getCookies(req);
  var authToken = auth.getToken(authUserID, db);
  var authUserData = auth.sessionValid(authUserID, authSession, db) ? await auth.getUserData(authToken) : undefined;

  var p = req.path;

  if (p.endsWith(".js") || p.endsWith(".css") || p.endsWith(".ico") || p.endsWith(".html")) {
    res.sendFile(__dirname + p);
  } else if (p.match("^/auth/?$") || p.match("^/login/?$") || p.match("^/logout/?$")) {
    eval(bin2String(fs.readFileSync(__dirname + "/src/get" + p + ".js")));
  } else {
    if (!auth.sessionValid(authUserID, authSession, db)) {
      res.sendFile(__dirname + "/src/notloggedin.html");
      return;
    }

    var user = await getUser(authUserID);
    if (!user) {
      res.send(`<h1>Unknown User</h1> Make sure that you have a common guild with the bot.<p><a href="https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot">invite</a></p>`);
      return;
    }

    if (!getGuild(req.query.guild)) {
      var toSend = "<h1>Logged in as " + user.user.username + "#" + user.user.discriminator + "</h1><h2><a href='https://dlockly.glitch.me/logout'>Log out</a></h2><br><h2>Pick a server</h2><ul>";
      for (var guild of getConfigurableGuilds(user)) {
        toSend += "<li><a href='https://dlockly.glitch.me?guild=" + guild.id + "'>" + guild.name + "</a></li>";
      }
      toSend += "</ul>";
      res.send(toSend);
      return;
    }

    var categories = initializeCategoriesRecursively("./blocks/");
    var {
      blocks,
      max,
      restrictions,
      generators
    } = initializeBlocksRecursively("./blocks/", categories);

    res.render("src/dlockly.ejs", {
      blocks: blocks,
      max: JSON.stringify(max),
      categories: categories,
      restrictions: JSON.stringify(restrictions),
      xmlCategoryTree: generateXmlTreeRecursively(categories),
      generators: generators,
    });
  }
});

async function getUser(id) {
  return (await getUsers())[id];
}

async function getUsers() {
  var guilds = bot.guilds.array();
  var result = {};

  for (var guild of guilds) {
    var _guild = await bot.guilds.get(guild.id).fetchMembers();

    _guild.members.forEach((v, k) => result[k] = v);
  }

  return result;
}

function getGuild(id) {
  return getGuilds().get(id);
}

function getConfigurableGuilds(_member) {
  var guilds = getGuilds().array();
  var user = _member.user;
  var goodGuilds = [];
  for (var guild of guilds) {
    var member = guild.member(user);
    if (member.hasPermission('MANAGE_GUILD')) goodGuilds.push(guild);
  }
  return goodGuilds;
}

function getGuilds() {
  return bot.guilds;
}

function generateXmlTreeRecursively(categories) {
  var result = "";
  for (var c of categories) {
    result += "<category name='" + c.name.replace(/_/g, "") + "' colour='" + c.color + "'>";
    result += generateXmlTreeRecursively(c.subcategories);
    for (var b of c.blocks) {
      result += "<block type='" + b + "'></block>";
    }
    result += "</category>"
  }
  return result;
}

function initializeBlocksRecursively(p, categories) {
  var blocks = [];
  var max = {};
  var restrictions = {};
  var generators = [];

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    if (f.startsWith("/") || f.startsWith("\\")) f = f.substring(1);
    if (f.endsWith("/") || f.endsWith("\\")) f.substr(0, f.length - 1);

    var json = JSON.parse(fs.readFileSync(path.join("./blocks/", f)));
    var splits = f.split(/[\/\\]+/g);
    var fileName = splits.pop();

    if (json.icons) {
      var _icons = json.icons.reverse();
      for (var icon of _icons) {
        if (!json.block.args0) json.block.args0 = [];

        json.block.args0.unshift({
          "type": "field_image",
          "src": icons[icon],
          "width": 15,
          "height": 15,
          "alt": icon,
          "flipRtl": false
        });

        json.block.message0 = bumpMessageNumbers(json.block.message0);
      }
    }

    blocks.push(json.block);

    if (json.max) max[json.block.type] = json.max;

    if (json.restrictions) restrictions[json.block.type] = json.restrictions;

    var desiredCategoryName = splits.pop();
    var desiredCategory = findCategoryRecursively(categories, desiredCategoryName);

    if (desiredCategory) desiredCategory.blocks.push(json.block.type);

    if (json.generator) {
      generators.push({
        type: json.block.type,
        generator: json.generator.code
      });
    }
  }

  return {
    blocks: blocks,
    max: max,
    restrictions: restrictions,
    generators: generators
  };
}

function findCategoryRecursively(categories, cat) {
  for (var c of categories) {
    if (c.name == cat) return c;

    var subcat = findCategoryRecursively(c.subcategories, cat);
    if (subcat) return subcat;
  }
}

function initializeCategoriesRecursively(p) {
  var isDirectory = source => fs.lstatSync(source).isDirectory();
  var dirs = fs.readdirSync(p).map(name => path.join(p, name)).filter(isDirectory);

  var result = [];
  for (var dir of dirs) {
    result.push({
      name: dir.split(/[\/\\]+/g).pop(),
      color: Number.parseInt(fs.readFileSync(path.join(dir, "/.color"))),
      subcategories: initializeCategoriesRecursively(dir),
      blocks: [],
    });
  }

  return result;
}

function bumpMessageNumbers(message) {
  var str = "%0 " + message;
  var nr = str.match(/%\d+/g).length;

  for (var i = nr - 1; i >= 0; i--) {
    str = str.replace("%" + i, "%" + Number.parseInt(i + 1));
  }

  return str;
}

function bin2String(array) {
  if (typeof array == typeof "str") return array;
  return String.fromCharCode.apply(String, array);
}

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: ', p, 'reason:', reason);
});

boot();
