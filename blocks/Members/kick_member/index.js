const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "kick_member";
block.message0 = "kick member %1";
block.args0.push(
  new Classes.ArgValue("member", "Member"),
);
block.inputsInline = false;
block.previousStatement = null;
block.nextStatement = null;
block.tooltip = "Kicks a member.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'member' parameter", ["member"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return 'await ' + Blockly.JavaScript.valueToCode(block, 'member', Blockly.JavaScript.ORDER_ATOMIC) + '.kick();';
}

module.exports = block;