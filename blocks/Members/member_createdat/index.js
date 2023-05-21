const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "member_createdat";
block.message0 = "get account creation date of member %1";
block.args0.push(
  new Classes.ArgValue("member", "Member"),
);
block.inputsInline = false;
block.output = "Date";
block.tooltip = "Gets the account creation date a member.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'member' parameter", ["member"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'member', Blockly.JavaScript.ORDER_ATOMIC) + '.user.createdAt', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;