const Classes = require("../../../src/classes");

var block = new Classes.Block(__dirname);
block.type = "emoji_url";
block.message0 = "get image url of emoji %1";
block.args0.push(
  new Classes.ArgValue("emoji", "Emoji"),
);
block.inputsInline = false;
block.output = "String";
block.tooltip = "Gets the image URL of an emoji.";
block.extra = block.readShadows();
block.restrictions = [
  new Classes.Restriction("notempty", "You must provide a value for the 'emoji' parameter", ["emoji"]),
]

/**
 * @param {import("node-blockly")} Blockly
 * @param {import("node-blockly").Block} block
 */
block.generator = function (Blockly, block) {
  // FIXME: Fix ORDERS for all blocks
  return [Blockly.JavaScript.valueToCode(block, 'emoji', Blockly.JavaScript.ORDER_ATOMIC) + '.url', Blockly.JavaScript.ORDER_MEMBER];
}

module.exports = block;