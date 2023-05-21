const Classes = require("../../src/classes");

// TODO: Event block class
var block = new Classes.Block(__dirname);
block.type = "on_message_edit";
block.message0 = "on message edited %1 %2";
block.args0.push(
  new Classes.ArgDummy(),
  new Classes.ArgStatement("code"),
);
block.colour = 0;
block.tooltip = "Triggers when a message was edited.";
block.icons = [
  "event",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block, data) {
  return ' module.exports.messageDelete = async (oldmessage, message) => { try { var channel = message.channel; var member = message.member; var guild = message.guild; ' + Blockly.JavaScript.statementToCode(block, 'code') + '} catch (e) { require(\"../../src/errors\").onerror(\"' + data.req.body.guild + '\", e); } }';
}

module.exports = block;