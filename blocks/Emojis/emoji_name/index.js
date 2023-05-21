const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "emoji_name";
block.message0 = "get name of emoji %1";
block.args0.push(
  new Classes.ArgValue("emoji", "Emoji"),
);
block.inputsInline = false;
block.output = "String";
block.tooltip = "Gets the name of an emoji.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'emoji' parameter", ["emoji"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  return [Blockly.JavaScript.valueToCode(block, 'emoji', Blockly.JavaScript.ORDER_ATOMIC) + '.name', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;