const Blockly = require('node-blockly');
const convert = require('xml-js');
const fs = require('fs');
const path = require('path');
const read = require('fs-readdir-recursive');

const auth = require('../src/auth');
const discord = require('../src/discord');
const dlockly = require('../src/dlockly');
const postprocess = require('../src/postprocess');
const premium = require('../src/premium');
const server = require('..');

module.exports = function (data) {
  try {
    if (!auth.sessionValid(data.req.cookies.auth_userid, data.req.cookies.auth_session, server.db) || !data.user) {
      data.res.redirect("/#invalidLogin");
      return;
    }
    var guilds = discord.getConfigurableGuilds(data.user).concat(discord.getConfigurableGuilds(data.user, true)).map(g => g.id);
    if (!guilds.includes(data.req.body.guild)) {
      data.res.redirect("/#invalidGuild");
      return;
    }

    if (!fs.existsSync(path.join(__dirname, "/../data/"))) fs.mkdirSync(path.join(__dirname, "/../data/"));
    if (!fs.existsSync(path.join(__dirname, "/../data/", data.req.body.guild))) fs.mkdirSync(path.join(__dirname, "/../data/", data.req.body.guild));

    var dlocklyInstance = dlockly.initialize(premium.hasPremium(data.req.body.guild));

    for (var block of dlocklyInstance.blocks) {
      if (block.default) continue;
      eval(`
        Blockly.Blocks['${block.type}'] = {
          init: function() {
            this.jsonInit(JSON.parse('${JSON.stringify(block).replace(/'/g, "\\'")}'));
          }
        }
      `);
    }

    for (var generator of dlocklyInstance.generators) {
      eval(`  
        Blockly.JavaScript["${generator.type}"] = function (block) {
          var _return;
          if (block.returns) eval("${generator.returnGen ? generator.returnGen : ""}".replace(/\\\\\\\\/g, "\\\\"));
          else eval("${generator.generator ? generator.generator : ""}".replace(/\\\\\\\\/g, "\\\\"));
          return _return;
        }
      `);
    }

    for (var reserved of [...new Set(dlocklyInstance.reserved)]) {
      Blockly.JavaScript.addReservedWords(reserved);
    }

    var xml = decodeURIComponent(data.req.body.xml);
    var parsedXml = convert.js2xml(removeOverwrittenShadowsRecursively(convert.xml2js(xml)));
    var dom = Blockly.Xml.textToDom(parsedXml);
    var workspace = new Blockly.Workspace({
      oneBasedIndex: true,
    });

    for (var mutator of dlocklyInstance.mutators) {
      eval(mutator);
    }

    Blockly.Xml.domToWorkspace(dom, workspace);
    var js = postprocess(Blockly.JavaScript.workspaceToCode(workspace));

    fs.writeFileSync(path.join(__dirname, "/../data/", data.req.body.guild, "/blockly.xml"), xml);
    fs.writeFileSync(path.join(__dirname, "/../data/", data.req.body.guild, "/config.js"), js);

    for (var block of dlocklyInstance.blocks) {
      if (block.optionalReturn) Blockly.Extensions.unregister(`${block.type}_optional_return_mutator`);
      if (block.mutator && Blockly.Extensions.ALL_[block.mutator]) Blockly.Extensions.unregister(block.mutator);
    }

    data.res.redirect("/?guild=" + data.req.body.guild);
  } catch (e) {
    console.error(e);

    if (dlocklyInstance && Array.isArray(dlocklyInstance.blocks)) {
      for (var block of dlocklyInstance.blocks) {
        if (block.optionalReturn) Blockly.Extensions.unregister(`${block.type}_optional_return_mutator`);
        if (block.mutator && Blockly.Extensions.ALL_[block.mutator]) Blockly.Extensions.unregister(block.mutator);
      }
    }

    data.res.redirect("/?guild=" + data.req.body.guild + "#error");
  }
}

function getBlocks(p) {
  var blocks = [];

  var files = read(p).filter(f => f.endsWith(".json"));

  for (var f of files) {
    if (f.startsWith("/") || f.startsWith("\\")) f = f.substring(1);
    if (f.endsWith("/") || f.endsWith("\\")) f.substr(0, f.length - 1);

    var json = JSON.parse(fs.readFileSync(path.join(p, f)));

    if (!json.generator) json.generator = '_return = \'\';';

    blocks.push(json);
  }

  return blocks;
}

function removeOverwrittenShadowsRecursively(obj) {
  var shadowElement, blockElement;
  if (obj.elements) {
    for (var element of obj.elements) {
      if (element.name == "shadow") shadowElement = element;
      if (element.name == "block") blockElement = element;
    }
  }

  if (shadowElement && blockElement) removeFromArray(obj.elements, shadowElement);

  if (obj.elements) {
    for (var index in obj.elements) {
      obj.elements[index] = removeOverwrittenShadowsRecursively(obj.elements[index]);
    }
  }

  return obj;
}

function removeFromArray(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}