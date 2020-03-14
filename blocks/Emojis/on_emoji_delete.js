const Classes = require("../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "on_emoji_delete";
block.message0 = "on emoji deleted %1 %2";
block.args0.push(
  new Classes.ArgDummy(),
  new Classes.ArgStatement("code"),
);
block.colour = 0;
block.tooltip = "Triggers when an emoji is deleted.";
block.icons = [
  "event",
];

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block, data) {
  return ' module.exports.emojiDelete = async channel => { try { var guild = channel.guild; ' + Blockly.JavaScript.statementToCode(block, 'code') + '} catch (e) { require(\"../../src/errors\").onerror(\"' + data.req.body.guild + '\", e); } }';
}

module.exports = block;