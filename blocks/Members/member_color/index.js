const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "member_color";
block.message0 = "get display color of member %1";
block.args0.push(
  new Classes.ArgValue("member", "Member"),
);
block.inputsInline = false;
block.output = [
  "Color",
  "Colour",
  "String", // TODO: Standardize types
];
block.tooltip = "Gets the display color of a member.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'member' parameter", ["member"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'member', Blockly.JavaScript.ORDER_ATOMIC) + '.displayHexColor', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;