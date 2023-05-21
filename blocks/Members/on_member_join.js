const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "on_member_join";
block.message0 = "on member joined %1 %2";
block.args0.push(
  new Classes.ArgDummy(),
  new Classes.ArgStatement("code"),
);
block.colour = 0;
block.tooltip = "Triggers when a member has joined the server.";
block.icons = [
  "event",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block, data) {
  return ' module.exports.guildMemberAdd = async member => { try { var guild = channel.guild; ' + Blockly.JavaScript.statementToCode(block, 'code') + '} catch (e) { require(\"../../src/errors\").onerror(\"' + data.req.body.guild + '\", e); } }';
}

module.exports = block;