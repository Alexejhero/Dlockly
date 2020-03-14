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
      if (!block.default) {
        eval(`
          Blockly.Blocks['${block.type}'] = {
            init: function() {
              try {
                this.jsonInit(JSON.parse('${JSON.stringify(block).replace(/'/g, "\\'")}'));
              } catch (e) {
                console.error(e + '\n' + '${JSON.stringify(block).replace(/'/g, "\\'")}');
              }
            }
          }
        `);
      }

      if (block.generator) {
        eval(`
          Blockly.JavaScript["${block.type}"] = function (block) {
            return dlocklyInstance.blocks.filter(b => b.type == "${block.type}")[0].generator(Blockly, block, data);
          }
        `);
      }
    }

    var rsv = dlocklyInstance.blocks.map(b => b.reserved).flat();
    for (var reserved of [...new Set(rsv)]) {
      Blockly.JavaScript.addReservedWords(reserved);
    }

    var xml = decodeURIComponent(data.req.body.xml);
    var parsedXml = convert.js2xml(removeOverriddenShadows(convert.xml2js(xml)));
    var dom = Blockly.Xml.textToDom(parsedXml);
    var workspace = new Blockly.Workspace({
      oneBasedIndex: true,
    });

    // TODO: Add mutators to back-end
    // for (var mutator of dlocklyInstance.mutators) {
    //   eval(mutator);
    // }

    workspace.options.maxInstances = {};
    for (var v of dlocklyInstance.blocks.filter(b => b.max)) workspace.options.maxInstances[v.type] = v.max;

    Blockly.Xml.domToWorkspace(dom, workspace);

    var restrictions = {};
    for (var v of dlocklyInstance.blocks) restrictions[v.type] = v.restrictions;
    eval(fs.readFileSync(path.join(__dirname, "../www/js/restrictions.js"), "utf-8"));

    var warnings = disableUnapplicable({
      type: Blockly.Events.MOVE,
      workspaceId: workspace.id,
    });
    if (warnings && warnings.length > 0) {
      console.log(warnings);
      throw Error("Cannot save with warnings. " + warnings.length + " warnings found.");
    }

    var blocks = {};
    for (var block of workspace.getAllBlocks()) {
      if (!blocks[block.type]) blocks[block.type] = 0;
      blocks[block.type]++;
    }
    for (var block in blocks) {
      if (blocks[block] > workspace.options.maxInstances[block]) {
        throw Error("Too many blocks of type " + block + ". Found " + blocks[block] + ", expecting <= " + workspace.options.maxInstances[block]);
      }
    }

    var js = postprocess(Blockly.JavaScript.workspaceToCode(workspace));

    fs.writeFileSync(path.join(__dirname, "/../data/", data.req.body.guild, "/blockly.xml"), xml);
    fs.writeFileSync(path.join(__dirname, "/../data/", data.req.body.guild, "/config.js"), js);

    // FIXME: Decache this to remove mutators

    data.res.redirect("/?guild=" + data.req.body.guild);
  } catch (e) {
    console.error(e);
    data.res.redirect("/?guild=" + data.req.body.guild + "#error");
  }
}

// TODO: Test to see if this works without this
function removeOverriddenShadows(obj) {
  var shadowElement, blockElement;
  if (obj.elements) {
    for (var element of obj.elements) {
      if (element.name == "shadow") shadowElement = element;
      if (element.name == "block") blockElement = element;
    }
  }

  if (shadowElement && blockElement) obj.elements = obj.elements.filter(e => e != shadowElement);

  if (obj.elements) {
    for (var index in obj.elements) {
      obj.elements[index] = removeOverriddenShadows(obj.elements[index]);
    }
  }

  return obj;
}
